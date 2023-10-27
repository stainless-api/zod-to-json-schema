"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTupleDef = void 0;
const parseDef_1 = require("../parseDef");
function parseTupleDef(def, refs) {
    if (def.rest) {
        return {
            type: "array",
            minItems: def.items.length,
            items: def.items
                .map((x, i) => (0, parseDef_1.parseDef)(x._def, Object.assign(Object.assign({}, refs), { currentPath: [...refs.currentPath, "items", `${i}`] })))
                .reduce((acc, x) => (x === undefined ? acc : [...acc, x]), []),
            additionalItems: (0, parseDef_1.parseDef)(def.rest._def, Object.assign(Object.assign({}, refs), { currentPath: [...refs.currentPath, "additionalItems"] })),
        };
    }
    else {
        return {
            type: "array",
            minItems: def.items.length,
            maxItems: def.items.length,
            items: def.items
                .map((x, i) => (0, parseDef_1.parseDef)(x._def, Object.assign(Object.assign({}, refs), { currentPath: [...refs.currentPath, "items", `${i}`] })))
                .reduce((acc, x) => (x === undefined ? acc : [...acc, x]), []),
        };
    }
}
exports.parseTupleDef = parseTupleDef;
