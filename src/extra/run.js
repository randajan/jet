import { isIterable, isRunnable, values } from "../defs/tools";



const _run = (any, args)=>{
    if (isRunnable(any)) { return any(...args); }
    if (!isIterable(any)) { return; }
    for (const val of values(any)) { _run(val, args); }
}

export const run = (any, ...args)=>_run(any, args);