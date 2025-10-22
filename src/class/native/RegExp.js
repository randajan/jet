import { anyToFn } from "@randajan/function-parser";
import { _str } from "./String";
import { rgxLib } from "../../defs/regex";
import { rgxToStr, strToRgx } from "@randajan/regex-parser";


export const _rgx = _str.extend("rgx", {
    self: RegExp,
    create: RegExp,
    copy: x => RegExp(x.source),
    toParent:rgx=>rgxToStr(rgx),
    fromParent:str=>strToRgx(str)
}).defineFrom({
    arr: (arr, opt) => new RegExp(arr.join(opt.glue ?? "|"), opt.flags),
    //bol:,
    //dt:,
    //err:,
    //fn:,
    //map:,
    //num:,
    //obj:,
    //rgx:,
    //set:,
    //str:,
    //sym:
}).addTools({
    lib: rgxLib
})