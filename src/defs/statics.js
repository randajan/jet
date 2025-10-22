import { NoDefinition } from "../class/self/NoDefinition";

const byName = new Map();
const byPrototype = new Map();

const _msg = (msg, name) => `jet${name ? ` type '${name}'` : ""} ${msg}`;
export const fail = (msg, name, cause) => { throw new Error(_msg(msg, name), { cause }); }
export const warn = (msg, name) => { console.warn(_msg(msg, name)); }

export const getDefByName = (name, throwError = false) => {
    const type = byName.get(name);
    if (type) { return type; }
    if (throwError) { fail(`undefined type '${name}'`); }
}

export const getTypesList = () => [...byName.keys()];

const getByInst = (any, def) => {
    if (def.is(any)) { return def; }
}

const _undefined = new NoDefinition();
export const getDefByInst = any => {
    if (any == null) { return _undefined; }
    const list = byPrototype.get(any.__proto__);
    if (!list || !list.length) { return _undefined; }
    if (list.length === 1) {
        const r = getByInst(any, list[0]);
        if (r) { return r; }
    } else {
        for (const def of list) {
            const r = getByInst(any, def);
            if (r) { return r; }
        }
    }
    return _undefined;
}

export const getTypeByInst = any => getDefByInst(any).type;

export const register = (def) => {
    const { name, self } = def.type;
    const prot = self.prototype;
    byName.set(name, def);
    const list = byPrototype.get(prot);
    if (list) { list.unshift(def); }
    else { byPrototype.set(prot, [def]); }
    resetConvPaths();
}

export const touchBy = (any, op, throwError, ...args) => {
    const type = getTypeByInst(any, false);

    if (type[op]) { return type[op](any, ...args); }
    if (!throwError) { return; }

    if (!type) { fail(`unable execute '${op}' - missing type of '${any}'`); }
    if (!type.isIterable) { fail(`undefined operation '${op}' - unavailable for this type`, type.name); }
}

//0 = filled, 1 = only, 2 = ensure, 3 = ensureCopy
export const factory = (type, mm, ...args) => {
    for (const a of args) {
        const d = getDefByInst(a);
        if (type && type !== d.type) { continue; }
        if (mm === 0 && !d.isFilled(a)) { continue; }
        return (mm === 3) ? d.copy(a) : a;
    }
    if (type && mm > 1) { return type.create(); }
}

export const isFilled = any => (any === false || any === 0 || !!any);
export const isFilleds = obj => {
    for (let i in obj) { if (isFilled(obj[i])) { return true; } }
    return false;
}


// CONVERSION GRAPH

const convPaths = new Map();     // "A→B" -> (v,...args)=>...

export const resetConvPaths = () => { convPaths.clear(); }

const _findConvPath = (fromDef, toDef) => {

    // 1) nasbírej předky ZDROJE (včetně něj)
    const ancestors = [];
    for (let cur = fromDef; cur;) {
        ancestors.push(cur);
        cur = cur.parent;
    }

    // 2) najdi NEJBLIŽŠÍHO předka, ze kterého má cil přímou konverzi
    for (const anc of ancestors) {
        const direct = toDef.from.get(anc.name);
        if (!direct) { continue; }

        // 3) poskládej LIFTY: from -> ... -> anc (POZOR: volá se child.type.to)
        const steps = [];
        for (let cDef = fromDef; cDef !== anc;) {
            const pDef = cDef?.parent;
            if (!pDef) { return; }  // bez liftu to nejde

            steps.push({ from: cDef.name, to: pDef.name, kind: 'lift', fn: pDef.from.get(cDef.name) });
            cDef = pDef;
        }

        // 4) přidej přímou konverzi ancestor -> target
        steps.push({ from: anc.name, to: toDef.name, kind: 'direct', fn: direct });
        return steps; // ← vracíme POUZE kroky (fns + popis)
    }

    return; // žádný vhodný předek nenašel přímou hranu do cíle
}

export const findConvPath = (fromDef, toDef)=>{
  if (fromDef === toDef) { return []; }

  const key = fromDef.name + '→' + toDef.name;
  if (convPaths.has(key)) { return convPaths.get(key); }

  const steps = _findConvPath(fromDef, toDef);
  if (!steps) { fail(`conversion to '${toDef.name}' not defined`, fromDef.name); }

  convPaths.set(key, steps);
  return steps;
}