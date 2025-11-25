export enum NailShape {
  Natural = 'Natural',
  Almond = 'Almond',
  Coffin = 'Coffin',
  Square = 'Square',
  Stiletto = 'Stiletto',
  Oval = 'Oval'
}

export enum NailLength {
  Short = 'Short',
  Medium = 'Medium',
  Long = 'Long',
  ExtraLong = 'Extra Long'
}

export enum NailFinish {
  Glossy = 'Glossy',
  Matte = 'Matte',
  Chrome = 'Chrome',
  Glitter = 'Glitter',
  Holographic = 'Holographic'
}

export interface NailDesignState {
  shape: NailShape;
  length: NailLength;
  finish: NailFinish;
  color: string; // Hex code
  patternPrompt: string;
}

export interface PresetDesign {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  config: Partial<NailDesignState>;
}

export const DEFAULT_DESIGN: NailDesignState = {
  shape: NailShape.Almond,
  length: NailLength.Medium,
  finish: NailFinish.Glossy,
  color: '#ffb7b2', // Soft pink
  patternPrompt: ''
};

// Global definition for WordPress settings injection
declare global {
  interface Window {
    nailArtSettings?: {
      apiKey: string;
      assetsUrl: string;
    };
  }
}