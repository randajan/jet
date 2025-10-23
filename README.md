# @randajan/jet

`@randajan/jet` is a unified runtime type and conversion toolkit for JavaScript.  
It extends native types with consistent behavior, powerful utilities, and an ecosystem of automatic conversions.

Supports **ESM and CJS**, works the same in both Node.js and browsers.  
Default build includes asynchronous types (such as `Promise`), while the synchronous-only version is available as:

```
@randajan/jet/sync
```

---

## ⚙️ Jet Ecosystem

The global `jet` object acts as a live registry of types, accessible via proxy:

```js
import { jet } from "@randajan/jet";

jet.str.to(123); // "123"
jet.num.to("42"); // 42
```

Each type exposes a unified interface:

| Method | Description |
|---------|--------------|
| `to(any, [options])` | Converts a value to the current type but `null` or `undefined` will pass |
| `tor(any, [options])` | Converts a value to the current type but on pasing `null` or `undefined` will be created new instance |
| `is(any)` | Checks if a value is of this type |
| `isFilled(any)` | Checks if value is non-empty |
| `copy(any)` | Creates a copy |
| `rnd(...)` | Generates a random value |
| `create(...)` | Creates a new instance |

Types can define custom conversions via `defineFrom(fromType, converter)` and may inherit from parent types.

---

## 🔄 Type Conversions

Conversions between types are automatic, directional, and follow inheritance chains.

```js
jet.num.to("123"); // 123
jet.str.to([1, 2, 3], { glue: "," }); // "1,2,3"
```

Use `.toDbg(any)` to inspect conversion paths.

Each conversion can have additional parameters (e.g. `{ glue }` for arrays → strings).

---

## 🧩 Types

### `str` — String
String type with extended manipulation tools.

- Tools: `capitalize`, `camelCase`, `pascalCase`, `snakeCase`, `delone`, `simplify`, `uid`, `fight`, `levenshtein`, `mutate`, etc.
- Extra: predefined unicode patterns via `hidePatterns`.

### `num` — Number
Number utilities with precision and random helpers.

- Tools: `x`, `frame`, `round`, `snap`, `zoomIn`, `zoomOut`, `diffusion`, `toHex`, `toLetter`.

### `bol` — Boolean
Boolean type. Always filled. Supports random ratio generation.

### `dt` — Date
Date type with random range generation and automatic parsing from strings/numbers.

### `arr` — Array
Iterable array type.

- Tools: `wrap`, `shuffle`, `compare`, `sliceMap`, `clean`.
- Converts from strings via `split` and optional `{ glue }`.

### `obj` — Object
Iterable key-value object.

- Tools: `filter`, `exclude`, `extract`.
- Converts from `Error` objects automatically.

### `map` — Map
Extends `obj`, providing two-way conversion between `obj` and `map`.

### `set` — Set
Extends `arr`, providing two-way conversion between `arr` and `set`.

### `rgx` — RegExp
Regular expression type with conversions to/from strings.

- Exposes `rgx.lib` — a library of predefined regex patterns (e.g. `number`, `email`, `ip`).

### `fn` — Function
Function type. Can be converted from most types using `@randajan/function-parser`.

- Tool: `benchmark(fces, inputs, iterations)` for performance testing.

### `prom` — Promise
Promise type. Supports conversions from nearly all types.  
Use the sync build (`@randajan/jet/sync`) if you need to exclude asynchronous behavior.

---

## 🔁 Iterable Types

Iterable types (`arr`, `set`, `map`, `obj`) share a unified API:

| Method | Description |
|---------|-------------|
| `keys(any)` | Returns all keys |
| `values(any)` | Returns all values |
| `entries(any)` | Returns `[key, value]` pairs |
| `get(any, key)` | Safely get a value |
| `set(any, key, value)` | Safely set a value |
| `del(any, key)` | Delete an entry |

These ensure that all iterable types can be traversed and mutated using the same syntax, regardless of structure.

---

## 🧠 Global Tools

The following utilities are exported globally for working with types and data.

| Function | Description | Arguments | Returns |
|-----------|-------------|------------|----------|
| `isFilled(any)` | Checks if a value is not empty | `any` | `boolean` |
| `isBlank(any)` | Opposite of `isFilled` | `any` | `boolean` |
| `isIterable(any)` | Checks if a type is iterable | `any` | `boolean` |
| `isRunnable(any)` | Checks if value is callable | `any` | `boolean` |
| `get(any, key)` | Safe getter for iterable types | `(any, key)` | `any` |
| `set(any, key, value)` | Safe setter | `(any, key, value)` | `any` |
| `del(any, key)` | Safe delete operation | `(any, key)` | `void` |
| `keys(any)` | Returns keys | `(any)` | `array` |
| `values(any)` | Returns values | `(any)` | `array` |
| `entries(any)` | Returns entries | `(any)` | `array` |
| `copy(any)` | Creates a deep copy | `(any)` | `any` |
| `filled(...args)` | Returns first non-empty value | `(...args)` | `any` |
| `getRnd(any, [min,max,sqr])` | Random element from iterable |  | `any` |
| `melt(any, comma, trait)` | Recursively concatenates values |  | `string` |
| `run(any, ...args)` | Runs function(s) or iterable of functions |  | `void` |
| `jsonFrom(any)` | Safe JSON.parse wrapper |  | `object` |
| `jsonTo(any, pretty)` | Safe JSON.stringify wrapper |  | `string` |
| `createEnum(enums, opt)` | Creates a safe enum getter | `(array, {before, after, def})` | `function` |

---

### Example: `createEnum`

```js
const color = createEnum(["red", "green", "blue"], { def: "red" });

color("green"); // "green"
color("yellow"); // "red" (default)
```

---

## 📜 License

MIT © randajan
