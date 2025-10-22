import { symToStr } from "../../defs/convert";
import { _str } from "./String";

export const _sym = _str.extend("sym", {
    self: Symbol,
    create: Symbol,
    isFilled:_=>true,
    copy: x => Symbol(symToStr(x)),
    rnd: (...a) => Symbol(_str.rnd(...a)),
    toParent:symToStr,
    fromParent:str=>Symbol(str)
});