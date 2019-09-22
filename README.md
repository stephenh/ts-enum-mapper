
ts-enum-mapper
==============

`ts-enum-mapper` makes it easy to have one-to-one relationships between an enum and a set of values.

I.e. instead of an exhaustive `switch` with a case-per-value and an `assertNever`, you can do one-line-per-value and still get the benefits of type-checking (because the compiler will enforce that your mapping definition has a key for each enum value):

```typescript
enum Color {
  Red = 'RED',
  Blue = 'BLUE',
  Green = 'GREEN',
}

const mapping = mapEnum(Color, {
  Red: 'red!',
  Blue: 'blue!',
  Green: 'green!',
});

expect(mapping.map(Color.Red)).toEqual('red!');
expect(mapping.parse('red!')).toEqual(Color.Red);
```

Instead of the more traditional:

```typescript
function mapColor(color: Color) {
  switch (color) {
    case Color.Red:
      return 'red!';
    case Color.Blue:
      return 'blue!';
    case Color.Green:
      return 'green!';
    default:
      return assertNever(color);
  }
}
```




