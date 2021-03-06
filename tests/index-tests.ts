import { EnumMapping, mapEnum, mapEnumToKeys, mapEnumToValues, mapEnumWithFn } from '../src';

enum Colors {
  Red = 'RED',
  Blue = 'BLUE',
  Green = 'GREEN',
}

enum Shapes {
  Circle,
  Square,
}

export enum FontSizeInPixels {
  F1 = 108,
  F2 = 96,
}

describe('mapEnum', () => {
  describe('for mappings', () => {
    const mapping = mapEnum(Colors, {
      Red: 'red!',
      Blue: 'blue!',
      Green: 'green!',
    });

    it('can map', () => {
      expect(mapping.map(Colors.Red)).toEqual('red!');
    });

    it('can parse', () => {
      expect(mapping.parse('red!')).toEqual(Colors.Red);
    });

    it('infers the value type as string', () => {
      const stringMapping: EnumMapping<typeof Colors, string> = mapping;
      expect(stringMapping.map(Colors.Red)).toEqual('red!');
    });
  });

  describe('for mappings with a known error', () => {
    const mapping = mapEnum(Colors, {
      Red: 'red!',
      Blue: 'blue!',
      Green: new Error('not green!'),
    });

    it('can map', () => {
      expect(mapping.map(Colors.Red)).toEqual('red!');
      expect(() => mapping.map(Colors.Green)).toThrow('not green!');
    });

    it('can parse', () => {
      expect(mapping.parse('red!')).toEqual(Colors.Red);
    });

    it('infers the value type as string', () => {
      const stringMapping: EnumMapping<typeof Colors, string> = mapping;
      expect(stringMapping.map(Colors.Red)).toEqual('red!');
    });
  });

  describe('for key mappings', () => {
    const mapping = mapEnumToKeys(Colors);

    it('can map', () => {
      expect(mapping.map(Colors.Red)).toEqual('Red');
    });

    it('can parse', () => {
      expect(mapping.parse('Red')).toEqual(Colors.Red);
    });

    it('infers the value type as string', () => {
      const stringMapping: EnumMapping<typeof Colors, string> = mapping;
      expect(stringMapping.map(Colors.Red)).toEqual('Red');
    });
  });

  describe('for value mappings', () => {
    const mapping = mapEnumToValues(Colors);

    it('can map', () => {
      expect(mapping.map(Colors.Red)).toEqual('RED');
    });

    it('can parse', () => {
      expect(mapping.parse('RED')).toEqual(Colors.Red);
    });

    it('infers the value type as string', () => {
      const stringMapping: EnumMapping<typeof Colors, string> = mapping;
      expect(stringMapping.map(Colors.Red)).toEqual('RED');
    });
  });

  describe('for numeric enum mappings', () => {
    const mapping = mapEnum(Shapes, {
      Circle: 'circle!',
      Square: 'square!',
    });

    it('can map', () => {
      expect(mapping.map(Shapes.Circle)).toEqual('circle!');
    });

    it('can parse', () => {
      expect(mapping.parse('square!')).toEqual(Shapes.Square);
    });
  });

  describe('for numeric enum value mappings', () => {
    const mapping = mapEnumToValues(Shapes);

    it('can map', () => {
      expect(mapping.map(Shapes.Circle)).toEqual(0);
    });

    it.skip('can parse', () => {
      // expect(mapping.parse(0)).toEqual(Shapes.Circle);
    });

    it.skip('infers the value type as string', () => {
      // const numberMapping: EnumMapping<typeof Shapes, number> = mapping;
      // expect(numberMapping.map(Shapes.Circle)).toEqual(0);
    });
  });

  describe('for number mappings', () => {
    const mapping = mapEnum(Colors, {
      Red: 1,
      Blue: 10,
      Green: 100,
    });

    it('can map', () => {
      expect(mapping.map(Colors.Red)).toEqual(1);
    });

    it('can parse', () => {
      expect(mapping.parse(100)).toEqual(Colors.Green);
    });
  });

  describe('for partial mappings', () => {
    const mapping = mapEnum(Colors, {
      Red: 'red!',
      Blue: 'blue!',
      Green: undefined,
    });

    it('can map', () => {
      expect(mapping.map(Colors.Red)).toEqual('red!');
      expect(mapping.map(Colors.Green)).toBeUndefined();
    });

    it('can parse', () => {
      expect(mapping.parse('red!')).toEqual(Colors.Red);
    });

    it('infers the value type as string or undefined', () => {
      const stringMapping: EnumMapping<typeof Colors, string | undefined> = mapping;
      expect(stringMapping.map(Colors.Red)).toEqual('red!');
    });
  });

  describe('mapEnumWithFn', () => {
    const FontSizeInRem = mapEnumWithFn(FontSizeInPixels, pixels => (pixels / 2).toFixed(2) + 'rem');

    it('maps', () => {
      expect(FontSizeInRem.F1).toEqual('54.00rem');
      expect(FontSizeInRem.F2).toEqual('48.00rem');
    });

    it('is typed correctly', () => {
      const f: Record<keyof typeof FontSizeInPixels, string> = FontSizeInRem;
      expect(f.F1).toEqual('54.00rem');
    });
  });
});
