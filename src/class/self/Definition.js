import { fail, getDefByName, register, warn } from "../../defs/statics";
import * as _ from "../../defs/statics";
import { Iterable } from "./Iterable";
import { Primitive } from "./Primitive";

const _options = [ "self", "fromParent", "toParent", "create", "is", "isFilled", "copy", "rnd", "keys", "values", "entries", "get", "set", "del" ];

export class Definition {

    static create(name, opt={}, parent=null) { return new Definition(name, opt, parent); }
    static createType(name, opt={}, parent=null) { return Definition.create(name, opt, parent).type; }

    constructor(name, opt={}, parent=null) {
        if (getDefByName(name)) { fail("is allready defined", name); }

        const { self, create, rnd, is, isFilled, copy, keys, values, entries, fromParent, toParent } = opt;

        if (!self) { fail("opt.self (constructor) missing", name); }
        if (parent && (!toParent || !fromParent)) { fail("opt.fromParent or opt.toParent missing", name); }
        if ((keys || values || entries) && !(keys && values && entries)) { fail("opt.keys, opt.values or opt.entries missing", name); }
        
        const unknownOpt = Object.keys(opt).filter(p => !_options.includes(p)); // validate options
        if (unknownOpt.length) { warn(`unknown definition: '${unknownOpt.join("', '")}'`, name); }

        this.parent = parent;
        this.name = name;
        this.create = create || ((...a)=>new self(...a));
        this.rnd = rnd || this.create;
        this.is = is || (_=>true);
        this.copy = copy || (_=>fail("copy method not defined", name));
        this.from = new Map(); //conversion table
        this.isFilled = isFilled || (!entries ? _.isFilled : any=>_.isFilleds(values(any)));
        this.type = entries ? new Iterable(this, name, opt) : new Primitive(this, name, opt);

        if (parent) {
            this.from.set(parent.name, fromParent);
            parent.from.set(name, toParent);
        }
        
        register(this);
    }
}