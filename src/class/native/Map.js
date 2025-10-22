import { anyToFn } from "@randajan/function-parser";
import { _obj } from "./Object";
import { mapToObj, objToMap } from "../../defs/convert";


export const _map = _obj.extend("map", {
    self:Map,
    isFilled:x=>!!x.size,
    copy:x=>new Map(x),
    keys:x=>[...x.keys()],
    values:x=>[...x.values()],
    entries:x=>[...x.entries()],
    get:(x,k)=>x.get(k),
    set:(x,k,v)=>x.set(k,v),
    del:(x,k)=>x.del(k),
    toParent:mapToObj,
    fromParent:objToMap
})