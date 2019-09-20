import { mapEnum, mapEnumToKeys, mapEnumToValues } from '../src';

enum Colors {
  Red = 'RED',
  Blue = 'BLUE',
  Green = 'GREEN',
}

enum Shapes {
  Circle,
  Square,
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
  });

  describe('for key mappings', () => {
    const mapping = mapEnumToKeys(Colors);

    it('can map', () => {
      expect(mapping.map(Colors.Red)).toEqual('Red');
    });

    it('can parse', () => {
      expect(mapping.parse('Red')).toEqual(Colors.Red);
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
});
