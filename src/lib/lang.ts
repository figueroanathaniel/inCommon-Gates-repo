import { useEffect } from "react";
import { setChartPrefs, useChartPrefs } from "./prefs";

/*
  中文, the language the art was written in. The reader may read the chart and
  the rooms' names in traditional characters alone. Kept on the device with
  the other choices about how a chart is shown. The scrolls stay in English.
*/

/** True while the reader has chosen 中文. */
export function useZh(): boolean {
  return useChartPrefs().lang === "zh";
}

export function setLang(lang: "en" | "zh") {
  setChartPrefs({ lang });
}

/** Tells the page which language its chart is in, so it is spoken and set rightly. */
export function useLangAttr() {
  const zh = useZh();
  useEffect(() => {
    document.documentElement.lang = zh ? "zh-Hant" : "en";
  }, [zh]);
}

export const YINYANG_ZH = { yin: "陰", yang: "陽" } as const;

/** An age in years and months, as 起運 is written. */
export const ageZh = (y: number, m: number) => (m ? `${y}歲${m}個月` : `${y}歲`);
