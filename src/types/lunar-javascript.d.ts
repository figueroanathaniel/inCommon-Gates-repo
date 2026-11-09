declare module "lunar-javascript" {
  export interface EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
  }
  export interface Lunar {
    getEightChar(): EightChar;
  }
  export interface Solar {
    getLunar(): Lunar;
  }
  export const Solar: {
    fromYmdHms(y: number, m: number, d: number, h: number, i: number, s: number): Solar;
  };
}
