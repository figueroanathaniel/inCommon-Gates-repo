declare module "lunar-javascript" {
  export interface EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    /** gender 1 for male, 0 for female; sect 2 counts by minutes. */
    getYun(gender: number, sect?: number): Yun;
  }
  export interface DaYun {
    getGanZhi(): string;
    getStartYear(): number;
    getStartAge(): number;
  }
  export interface Yun {
    getStartYear(): number;
    getStartMonth(): number;
    getStartDay(): number;
    getStartHour(): number;
    isForward(): boolean;
    getDaYun(n?: number): DaYun[];
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
