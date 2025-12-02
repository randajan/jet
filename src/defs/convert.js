import { numFormat } from "./numFormat";
import { rgxLib } from "./regex";


export const strToNum = (str, opt={}) => {
    if (!str) { return; }
    const match = str.replace(/\u00A0/g, ' ').match(rgxLib.number);
    if (!match || !match[0]) { return; }
    const n = Number(match[0].replaceAll(" ", "").replace(",", "."));
    if (!isNaN(n)) { return numFormat(n, opt); }
}


export const symToStr = sym => String(sym).slice(7, -1);

export const strToObj = str => {
    const obj = JSON.parse(str);
    if (typeof obj === "object") { return obj; }
    throw Error(`"${str}" is not valid JSON object`);
}

export const errToObj = err => {
    const plain = {};
    for (const key of Object.getOwnPropertyNames(err)) {
        plain[key] = err[key];
    }
    return plain;
}


export const numToDt = num => {
    const dt = new Date();
    dt.setTime(num);
    return dt;
}


export const mapToObj = map=>Object.fromEntries(map.entries());
export const objToMap = obj=>new Map(Object.entries(obj));


export const arrToStr = (arr, {glue})=>arr.join(glue ?? "");