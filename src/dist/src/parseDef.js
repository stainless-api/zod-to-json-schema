"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDef = void 0;
const zod_1 = require("zod");
const any_1 = require("./parsers/any");
const array_1 = require("./parsers/array");
const bigint_1 = require("./parsers/bigint");
const boolean_1 = require("./parsers/boolean");
const branded_1 = require("./parsers/branded");
const catch_1 = require("./parsers/catch");
const date_1 = require("./parsers/date");
const default_1 = require("./parsers/default");
const effects_1 = require("./parsers/effects");
const enum_1 = require("./parsers/enum");
const intersection_1 = require("./parsers/intersection");
const literal_1 = require("./parsers/literal");
const map_1 = require("./parsers/map");
const nativeEnum_1 = require("./parsers/nativeEnum");
const never_1 = require("./parsers/never");
const null_1 = require("./parsers/null");
const nullable_1 = require("./parsers/nullable");
const number_1 = require("./parsers/number");
const object_1 = require("./parsers/object");
const optional_1 = require("./parsers/optional");
const pipeline_1 = require("./parsers/pipeline");
const promise_1 = require("./parsers/promise");
const record_1 = require("./parsers/record");
const set_1 = require("./parsers/set");
const string_1 = require("./parsers/string");
const tuple_1 = require("./parsers/tuple");
const undefined_1 = require("./parsers/undefined");
const union_1 = require("./parsers/union");
const unknown_1 = require("./parsers/unknown");
function parseDef(def, refs, forceResolution = false // Forces a new schema to be instantiated even though its def has been seen. Used for improving refs in definitions. See https://github.com/StefanTerdell/zod-to-json-schema/pull/61.
) {
    const seenItem = refs.seen.get(def);
    if (seenItem && !forceResolution) {
        const seenSchema = get$ref(seenItem, refs);
        if (seenSchema !== undefined) {
            return seenSchema;
        }
    }
    const newItem = { def, path: refs.currentPath, jsonSchema: undefined };
    refs.seen.set(def, newItem);
    const jsonSchema = selectParser(def, def.typeName, refs);
    if (jsonSchema) {
        addMeta(def, refs, jsonSchema);
    }
    newItem.jsonSchema = jsonSchema;
    return jsonSchema;
}
exports.parseDef = parseDef;
const get$ref = (item, refs) => {
    switch (refs.$refStrategy) {
        case "root":
            return {
                $ref: item.path.length === 0
                    ? ""
                    : item.path.length === 1
                        ? `${item.path[0]}/`
                        : item.path.join("/"),
            };
        case "relative":
            return { $ref: getRelativePath(refs.currentPath, item.path) };
        case "none": {
            if (item.path.length < refs.currentPath.length &&
                item.path.every((value, index) => refs.currentPath[index] === value)) {
                console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
                return {};
            }
            return undefined;
        }
        case "seen": {
            if (item.path.length < refs.currentPath.length &&
                item.path.every((value, index) => refs.currentPath[index] === value)) {
                console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
                return {};
            }
            else {
                return item.jsonSchema;
            }
        }
    }
};
const getRelativePath = (pathA, pathB) => {
    let i = 0;
    for (; i < pathA.length && i < pathB.length; i++) {
        if (pathA[i] !== pathB[i])
            break;
    }
    return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
const selectParser = (def, typeName, refs) => {
    switch (typeName) {
        case zod_1.ZodFirstPartyTypeKind.ZodString:
            return (0, string_1.parseStringDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodNumber:
            return (0, number_1.parseNumberDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodObject:
            return (0, object_1.parseObjectDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodBigInt:
            return (0, bigint_1.parseBigintDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodBoolean:
            return (0, boolean_1.parseBooleanDef)();
        case zod_1.ZodFirstPartyTypeKind.ZodDate:
            return (0, date_1.parseDateDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodUndefined:
            return (0, undefined_1.parseUndefinedDef)();
        case zod_1.ZodFirstPartyTypeKind.ZodNull:
            return (0, null_1.parseNullDef)(refs);
        case zod_1.ZodFirstPartyTypeKind.ZodArray:
            return (0, array_1.parseArrayDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodUnion:
        case zod_1.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return (0, union_1.parseUnionDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodIntersection:
            return (0, intersection_1.parseIntersectionDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodTuple:
            return (0, tuple_1.parseTupleDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodRecord:
            return (0, record_1.parseRecordDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodLiteral:
            return (0, literal_1.parseLiteralDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodEnum:
            return (0, enum_1.parseEnumDef)(def);
        case zod_1.ZodFirstPartyTypeKind.ZodNativeEnum:
            return (0, nativeEnum_1.parseNativeEnumDef)(def);
        case zod_1.ZodFirstPartyTypeKind.ZodNullable:
            return (0, nullable_1.parseNullableDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodOptional:
            return (0, optional_1.parseOptionalDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodMap:
            return (0, map_1.parseMapDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodSet:
            return (0, set_1.parseSetDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodLazy:
            return parseDef(def.getter()._def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodPromise:
            return (0, promise_1.parsePromiseDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodNaN:
        case zod_1.ZodFirstPartyTypeKind.ZodNever:
            return (0, never_1.parseNeverDef)();
        case zod_1.ZodFirstPartyTypeKind.ZodEffects:
            return (0, effects_1.parseEffectsDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodAny:
            return (0, any_1.parseAnyDef)();
        case zod_1.ZodFirstPartyTypeKind.ZodUnknown:
            return (0, unknown_1.parseUnknownDef)();
        case zod_1.ZodFirstPartyTypeKind.ZodDefault:
            return (0, default_1.parseDefaultDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodBranded:
            return (0, branded_1.parseBrandedDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodCatch:
            return (0, catch_1.parseCatchDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodPipeline:
            return (0, pipeline_1.parsePipelineDef)(def, refs);
        case zod_1.ZodFirstPartyTypeKind.ZodFunction:
        case zod_1.ZodFirstPartyTypeKind.ZodVoid:
        case zod_1.ZodFirstPartyTypeKind.ZodSymbol:
            return undefined;
        default:
            return ((_) => undefined)(typeName);
    }
};
const addMeta = (def, refs, jsonSchema) => {
    if (def.description) {
        jsonSchema.description = def.description;
        if (refs.markdownDescription) {
            jsonSchema.markdownDescription = def.description;
        }
    }
    // @ts-expect-error
    if (def.internal) {
        // @ts-expect-error
        jsonSchema.internal = def.internal;
    }
    return jsonSchema;
};
