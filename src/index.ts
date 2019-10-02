type Mapping<T, V> = {
  [key in keyof T]: V | Error;
};

/**
 * Creates a 1-to-1 mapping between each enum key and the given value.
 *
 * The `V extends M[keyof T]` is a little weird, but see https://stackoverflow.com/q/58207537/355031.
 *
 * Mappings that have errors included, i.e. `Red: new Error()`, are still mapped as
 * if the error was not included, i.e. as strings/numbers/etc. This is technically
 * not as type-safe, i.e. mapping it as `Red: undefined`, is a better alternative
 * if your use case needs it.
 */
export function mapEnum<T, M extends Record<keyof T, unknown>, V extends Exclude<M[keyof T], Error>>(
  enumObj: T,
  values: M
): EnumMapping<T, V> {
  return new EnumMappingImpl(enumObj, values as any);
}

type Values<V> = {
  a: V;
  b: V;
};

function mapValues<V>(v: Values<V>): V {
  return v as any;
}
const vn = mapValues({ a: 1, b: 2 }); // inferred number
const vs = mapValues({ a: '1', b: '2' }); // inferred string

function mapValues2<V>(v: { [key: string]: V }): V {
  return v as any;
}
const v2n = mapValues2({ a: 1, b: 2 }); // inferred number
const v2s = mapValues2({ a: '1', b: '2' }); // inferred string

enum Foo {
  a,
  b,
}
function mapValues3<K, V>(o: K, v: { [key in keyof K]: V }): V {
  return v as any;
}
const v3n = mapValues3(Foo, { a: 1, b: 2 }); // inferred unknown
const v3s = mapValues3(Foo, { a: '1', b: '2' }); // inferred unknown

/**
 * Returns a map of the enum to/from it's keys as strings
 *
 * I.e. `map(Colors.Red) --> "Red"` and `parse("Red") --> Colors.Red`.
 */
export function mapEnumToKeys<T, V>(enumObj: T): EnumMapping<T, V> {
  // Set values to Red: Red, Blue: Blue, etc.
  return new EnumMappingImpl(
    enumObj,
    Object.assign(
      {},
      ...Object.keys(enumObj).map(e => {
        return { [e]: e };
      })
    )
  );
}

/**
 * Returns a map of the enum to/from it's values as strings
 *
 * I.e. `map(Colors.Red) --> "RED"` and `parse("RED") --> Colors.Red`.
 */
export function mapEnumToValues<T, V>(enumObj: T): EnumMapping<T, V> {
  // Set values to Red: RED, Blue: BLUE, etc.
  return new EnumMappingImpl(
    enumObj,
    Object.assign(
      {},
      ...Object.entries(enumObj).map(([k, v]) => {
        return { [k]: v };
      })
    )
  );
}

/** A bi-directional enum <-> value mappings. */
export interface EnumMapping<T, V> {
  map(enumValue: T[keyof T]): V;

  parse(mappedValue: V): T[keyof T];
}

/**
 * Holds bi-directional enum <-> value mappings.
 *
 * Index does not currently enforce uniqueness of values. I.e. technically multiple
 * enums can map to a single value, and `map` will work just fine, but `parse` will return
 * the 1st matching enum.
 *
 * Index also only works for non-const enums because we use `Object.entries`/etc. against
 * the enum objects that TypeScript emits. You'll get a compile error if you try to pass a const
 * enum to Index's constructor.
 */
class EnumMappingImpl<T, V> implements EnumMapping<T, V> {
  /** A mapping from the enum _key_, i.e. Red for `enum { Red = RED }`, to our mapped value. */
  private readonly values: { [key in keyof T]: V | Error };

  private readonly enumToMappedValue: Map<T[keyof T], V | Error> = new Map();
  private readonly mappedValueToEnum: Map<V, T[keyof T]> = new Map();

  constructor(private enumObj: T, values: { [key in keyof T]: V | Error }) {
    this.values = values;
    Object.entries(this.enumObj).forEach(([enumKey, enumValue]) => {
      const mappedValue = values[enumKey as keyof T];
      this.enumToMappedValue.set(enumValue, mappedValue);
      if (!(mappedValue instanceof Error)) {
        this.mappedValueToEnum.set(mappedValue as V, enumValue);
      }
    });
  }

  // Use lambdas so we can be passed as function pointers.
  map = (enumValue: T[keyof T]): V => {
    const mappedValue = this.enumToMappedValue.get(enumValue);
    if (mappedValue instanceof Error) {
      throw mappedValue;
    }
    // mappedValue might be undefined if they typed the mappings that way.
    return mappedValue!;
  };

  parse = (mappedValue: V): T[keyof T] => {
    const enumValue = this.mappedValueToEnum.get(mappedValue);
    if (enumValue === undefined) {
      throw new Error(`Invalid mapped valued ${mappedValue}`);
    }
    return enumValue;
  };
}

export type Public<T> = {
  [key in keyof T]: T[key];
};
