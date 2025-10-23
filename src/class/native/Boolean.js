import { bolRnd } from "../../defs/crypt";
import { Definition } from "../self/Definition";

const boolPats = /^(y(es|eah)?|t(rue)?|on|ok(ay)?|enable(d)?|(allow|accept)(ed)?|active|\d*[1-9]+\d*([,.]\d+)?|\d*[,.]\d*[1-9]+\d*)$/i


export const _bol = Definition.createType("bol", {
    self:Boolean,
    create:Boolean,
    isFilled:_=>true,
    copy:bol=>bol,
    rnd:bolRnd,
}).defineFrom({
    arr:v=>true, //    bol: arr => !!arr.length,
    //bol:,
    dt:v=>!!v.getTime(),
    err:v=>true,
    fn:v=>true,
    num:v=>!!v,
    obj:v=>true,
    rgx:v=>true,
    set:v=>true,
    str:str=>_bol.strPattern.test(str.trim())
}).addTools({
    strPattern:boolPats
})

