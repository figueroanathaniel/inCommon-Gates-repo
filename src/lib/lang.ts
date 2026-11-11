import { useEffect } from "react";
import { setChartPrefs, useChartPrefs } from "./prefs";

/*
  中文, the language the art was written in. The Academy is read wholly in one
  language at a time: in English every word is English, and in 中文 every word
  is traditional Chinese. Kept on the device with the other choices about how a
  chart is shown. The one word that crosses over is the switch's own label,
  which names the other language in that language.
*/

/** True while the reader has chosen 中文. */
export function useZh(): boolean {
  return useChartPrefs().lang === "zh";
}

/** Picks the line for the language the reader chose. */
export function useT(): (en: string, zh: string) => string {
  const zh = useZh();
  return (en, zh2) => (zh ? zh2 : en);
}

const DIG = "〇一二三四五六七八九";
/** A whole number from 0 to 99 in Chinese numerals. */
export function numZh(n: number): string {
  if (n < 10) return DIG[n];
  const t = Math.floor(n / 10), u = n % 10;
  return (t > 1 ? DIG[t] : "") + "十" + (u ? DIG[u] : "");
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

/** The house's own refusals, as they read in 中文. A message not listed stays as it came. */
const ERR_ZH: Record<string, string> = {
  "This device would not keep it. Private browsing can refuse storage.": "此裝置未能存下。私密瀏覽可能拒絕儲存。",
  "The house could not reach your account just now. Try again in a moment.": "書院此刻未能連上你的帳戶。請稍後再試。",
  "That birth does not read as a date and a time the house can cast.": "此生辰未能讀為書院可排之日與時。",
  "That time zone is not one the house knows.": "書院不識此時區。",
  "The Desk keeps six charts at most.": "書桌至多存六張命盤。",
  "No such scroll.": "無此卷。",
  "The house is still opening. Try again in a moment.": "書院尚在開門。請稍後再試。",
};

export function useErr(): (msg: string) => string {
  const zh = useZh();
  return (msg) => (zh ? ERR_ZH[msg] ?? msg : msg);
}
