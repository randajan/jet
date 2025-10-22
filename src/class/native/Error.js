import { anyToFn } from "@randajan/function-parser";
import { _str } from "./String";
import { mapToObj, symToStr } from "../../defs/convert";
import { rgxToStr } from "@randajan/regex-parser";

export const _err = _str.extend("err", {
    self:Error,
    create:Error,
    rnd:(...a)=>new Error(_str.rnd(...a)),
    toParent:err=>err.message,
    fromParent:(str, opt)=>new Error(str, opt)
}).defineFrom({
    arr:(arr, opt)=>new Error(arr.join(opt.glue ?? " ")),
    bol:(bol, opt)=>new Error(String(bol), opt),
    dt:(dt, opt)=>new Error(dt.toLocaleString(), opt),
    //err:,
    //fn:,
    //map,
    num:(num, opt)=>new Error(num, opt),
    //obj,
    //rgx,
    //set,
    //str,
    //sym
})