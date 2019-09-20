
ts-enum-mapper
==============

`ts-enum-mapper` makes it easy to have one-to-one relationships between an enum and a set a values.

I.e. instead of an exhaustive `switch` with a case-per-value and an `assertNever`, you can do one-line-per-value:

```typescript
enum Colors {
  Red = 'RED',
  Blue = 'BLUE',
  Green = 'GREEN',
}

const mapping = mapEnum(Colors, {
  Red: 'red!',
  Blue: 'blue!',
  Green: 'green!',
});

expect(mapping.map(Colors.Red)).toEqual('red!');
expect(mapping.parse('red!')).toEqual(Colors.Red);
```




