import { bolRnd } from "../../defs/crypt";
import { Definition } from "../self/Definition";
import { strToBol } from "../../defs/convert";


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
    str:strToBol
})

