import { jet } from "./defs";

import { _getRnd, getRnd } from "./extra/rnd.js";
import { createEnum } from "./extra/enum.js";
import { jsonFrom, jsonTo } from "./extra/json.js";
import { run } from "./extra/run.js";

import { FnProxy } from "./class/self/FnProxy.js";
import { Iterable } from "./class/self/Iterable.js";

import { _str } from "./class/native/String.js";
import { _num } from "./class/native/Number.js";
import "./class/native/*";
import { melt } from "./extra/melt.js";


//must be here to prevent loop
Iterable.prototype.getRnd = function (any, min, max, sqr) {
    return _getRnd(this.values(any), min, max, sqr);
}

export default jet;
export {
    jet,
    run,
    getRnd,
    createEnum,
    jsonFrom,
    jsonTo,
    melt,
    FnProxy,
}

export * from "./defs/tools.js";