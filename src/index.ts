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
export class EnumMapping<T, V> {
  /** A mapping from the enum _key_, i.e. Red for `enum { Red = RED }`, to our mapped value. */
  private readonly values: { [key in keyof T]: V | Error };

  constructor(private enumObj: T, values?: { [key in keyof T]: V | Error }) {
    this.values =
      values ||
      // Set values to Red: Red, Blue: Blue, etc.
      Object.assign(
        {},
        ...Object.keys(enumObj).map(e => {
          return { [e]: e };
        })
      );
  }

  // Use lambdas so we can be passed as function pointers.
  map = (enumValue: T[keyof T]): V => {
    // Change the enum key, i.e. Colors.RED --> Red
    const key =
      ((Object.entries(this.enumObj)
        .filter(([k, v]) => v === enumValue)
        .map(([k]) => k)[0] as unknown) as keyof T) || fail();
    const value = this.values[key] as V | Error;
    if (value instanceof Error) {
      throw value;
    }
    return value;
  };

  parse = (mappedValue: V): T[keyof T] => {
    const matched = Object.entries(this.values)
      .filter(([k, v]) => v === mappedValue)
      .map(([k]) => k as keyof T);
    const key = matched[0] || fail(`Invalid value ${mappedValue}`);
    return this.enumObj[key];
  };
}
