import { solids } from "../../defs/solid";
import { getDefByInst, fail, factory, getTypeByInst, findConvPath } from "../../defs/statics";
import { NoType } from "./NoType";

export class Primitive extends NoType {
    static isIterable = false;

    constructor(def, name, opt) {
        super(def, name);

        const { self, fallback } = opt;

        solids(this, { self, fallback });
    }

    create(...a) { return this.create(...a); }
    rnd(...a) { return this.rnd(...a); }

    is(any) { //rebinded def
        const { self } = this.type; 
        if (any == null) { return false; }
        if (any.constructor !== self && !(any instanceof self)) { return false; }
        return this.type === getTypeByInst(any);
    }

    isFilled(any) { //rebinded def
        const { type:{ is }, isFilled } = this;
        return is(any) && !!isFilled(any);
    }

    isBlank(any) { //rebinded def
        const { type:{ is }, isFilled } = this;
        return is(any) && !isFilled(any);
    }
    
    to(any, opt={}) { //rebinded def
        const dTo = this;
        const dFrom = getDefByInst(any, false);
        const convPath = findConvPath(dFrom, dTo);
        if (typeof opt === "string") { opt = { glue:opt } }
        try { return convPath.reduce((v, step) => step.fn(v, opt), any); }
        catch(err) { fail(`conversion to '${dTo.name}' failed`, dFrom.name, err); }
    }

    toDbg(any) {
        const dTo = this;
        const dFrom = getDefByInst(any, false);
        const convPath = findConvPath(dFrom, dTo);
        return convPath.map(p=>({...p}));
    }
    
    orNull(any, opt={}) { //rebinded def
        return any == null ? null : this.type.to(any, opt);
    }

    copy(any) { //rebinded def
        const { name, is } = this.type;
        if (is(any)) { return this.copy(any); }
        fail(`copy failed - type mismatch`, name);
    }

    filled(...a) { return factory(this, 0, ...a); }
    only(...a) { return factory(this, 1, ...a); }
    ensure(...a) { return factory(this, 2, ...a); }
    ensureCopy(...a) { return factory(this, 3, ...a); }
}