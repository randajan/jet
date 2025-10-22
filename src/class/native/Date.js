import { _num } from "./Number";
import { Definition } from "../self/Definition";
import { numToDt, symToStr } from "../../defs/convert";


export const _date = Definition.createType("dt", {
    self:Date,
    create:x=>!x ? new Date() : new Date(x),
    copy:dt=>new Date(dt),
    isFilled:dt=>!isNaN(dt.getTime()),
    rnd:(from, to)=>new Date(_num.rnd((new Date(from)).getTime(), to ? (new Date(to)).getTime() : Date.now()*2)),
}).defineFrom({
    //arr:,
    //bol:,
    //dt:,
    //err:,
    //fn:,
    num:numToDt,
    //obj:,
    //rgx:,
    //set:,
    str:v=>new Date(Date.parse(v))
})