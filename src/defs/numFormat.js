
const _rounds = ["round", "floor", "ceil"];
const _rests = ["clamp", "wrap", "leave", "min", "max"];

export const numFormat = (num, opt = {}) => {
    if (!isFiniteNumber(num)) { return num; }

    let {
        min = null,
        max = null,
        snap = null,            // krok – určuje i "přesnost" (např. 0.01 -> 2 desetinná místa)
        round,                  // "floor" | "ceil" | "round"
        rest,                   // "wrap" | "leave" | "min" | "max" | "clamp"
    } = opt;

    const hasMin = min != null;
    const hasMax = max != null;
    const hasSnap = isFiniteNumber(snap) && snap > 0;
    const hasRound = round != null;
    const hasFrame = rest != null;

    // 1) když fakt nic nenastavíš, vrátíme číslo jak je
    if (!hasMin && !hasMax && !hasSnap && !hasRound && !hasFrame) { return num; }

    // normalizace rest
    rest = _rests.includes(rest) ? rest : _rests[0];

    // normalizace round
    round = _rounds.includes(round) ? round : _rounds[0];

    if (rest === "wrap" && (!hasMin || !hasMax)) {
        throw new Error("number format opt.rest='wrap' requires opt.min and opt.max");
    }

    let v = num;

    // 2) SNAP hodnoty (pokud je snap)
    if (hasSnap) { v = snapValue(v, snap, min, max, round); }

    // 3) SNAP i pro max (pokud existuje) vždy FLOOR
    if (hasMin && hasMax && hasSnap) {
        max = snapValue(max, snap, min, max, "floor");
    }

    // 4) WRAP pokud rest === "wrap"
    if (rest === "wrap") {
        v = wrap(v, min, max);
    } else if (rest === "min" && hasMin) {
        v = Math.max(v, min);
    } else if (rest === "max" && hasMax) {
        v = Math.min(v, max);
    } else if (rest === "clamp") {
        v = clamp(v, hasMin ? min : null, hasMax ? max : null);
    }

    return v;
};

// ===== Pomocné funkce =====

const isFiniteNumber = (v) =>
    typeof v === "number" && Number.isFinite(v);

const fixFloat = (v) => {
    if (!isFiniteNumber(v)) return v;
    return Number(v.toFixed(12)); // dost na to, aby zmizely 2.3000000000000007
};

const clamp = (v, min, max) => {
    if (min != null && v < min) v = min;
    if (max != null && v > max) v = max;
    return v;
};

// SNAP – zarovnání na grid podle snap, s anchor na min / max / 0
const snapValue = (value, step, min, max, round) => {
    if (!isFiniteNumber(value) || !(step > 0)) return value;

    const hasMin = min != null;
    const hasMax = max != null;

    // anchor:
    // - když je min -> grid: min + k*step (3, 8, 13, ...)
    // - když není min, ale je max -> grid: ..., max-2*step, max-step, max
    // - když není nic -> grid: k*step (0, step, 2*step, ...)
    if (hasMin) {
        const q = (value - min) / step;
        const k = roundRatio(q, round);
        return fixFloat(min + k * step);
    } else if (hasMax) {
        const q = (max - value) / step;
        const k = roundRatio(q, round);
        return fixFloat(max - k * step);
    } else {
        const q = value / step;
        const k = roundRatio(q, round);
        return fixFloat(k * step);
    }
};

const roundRatio = (q, mode) => {
    if (mode === "floor") return Math.floor(q);
    if (mode === "ceil") return Math.ceil(q);
    return Math.round(q);
};

// WRAP – ciferník mezi [min, max)
const wrap = (v, min, max) => {
    const range = max - min;
    if (!(range > 0)) return min != null ? min : v;

    let x = (v - min) % range;
    if (x < 0) x += range;

    return fixFloat(min + x);
};
