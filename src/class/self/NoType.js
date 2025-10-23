import { solids } from "../../defs/solid";
import { fail, isFilled, resetConvPaths } from "../../defs/statics";
import { FnProxy } from "./FnProxy";



export class NoType extends FnProxy {
    static isIterable = false;

    constructor(def, name) {
        super((...a)=>this.create(...a));

        const { isIterable } = this.constructor;

        solids(this, {
            name,
            isIterable,
            create:this.create.bind(def),
            rnd:this.rnd.bind(def),
            is:this.is.bind(def),
            convert:this.convert.bind(def),
            convertDbg:this.convertDbg.bind(def),
            to:this.to.bind(def),
            tor:this.tor.bind(def),
            copy:this.copy.bind(def),
            isFilled:this.isFilled.bind(def),
            isBlank:this.isBlank.bind(def),
            defineFrom:this.defineFrom.bind(def),
            extend:this.extend.bind(def)
        });
    }

    create() {}
    rnd() {}

    is(any) { return false; }

    convert() {}
    convertDbg(any) {}

    to(any, ...args) {  }
    tor(any, ...args) {}

    copy(any) { fail("unknown type copy failed"); }

    isFilled(any) { return isFilled(any); }

    isBlank(any) { return !isFilled(any); }

    defineFrom(from, exe) {
        const tf = typeof from;
        if (Array.isArray(from)) { for (let f of from) { this.from.set(f, exe); } }
        else if (tf === "object") { for (let i in from) { this.from.set(i, from[i]); } }
        else if (tt === "string") { this.from.set(i, exe); }
        else { fail(`from must be typeof string, array or object`, this.name); }
        resetConvPaths();
        return this.type;
    }

    addTools(tools={}) {
        if (typeof tools !== "object") { fail(`tools must be typeof object`, this.name); }
        solids(this, tools);
        return this;
    }

    extend(name, opt={}) {
        return this.constructor.createType(name, opt, this);
    }
}