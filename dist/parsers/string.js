"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStringDef = exports.emojiPattern = exports.ulidPattern = exports.cuid2Pattern = exports.cuidPattern = exports.emailPattern = void 0;
const errorMessages_1 = require("../errorMessages");
exports.emailPattern = '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\\])|(\\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\\.[A-Za-z]{2,})+))$';
exports.cuidPattern = "^c[^\\s-]{8,}$";
exports.cuid2Pattern = "^[a-z][a-z0-9]*$";
exports.ulidPattern = "/[0-9A-HJKMNP-TV-Z]{26}/";
exports.emojiPattern = "/^(p{Extended_Pictographic}|p{Emoji_Component})+$/u";
function parseStringDef(def, refs) {
    const res = {
        type: "string",
    };
    if (def.checks) {
        for (const check of def.checks) {
            switch (check.kind) {
                case "min":
                    (0, errorMessages_1.setResponseValueAndErrors)(res, "minLength", typeof res.minLength === "number"
                        ? Math.max(res.minLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "max":
                    (0, errorMessages_1.setResponseValueAndErrors)(res, "maxLength", typeof res.maxLength === "number"
                        ? Math.min(res.maxLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "email":
                    switch (refs.emailStrategy) {
                        case "format:email":
                            addFormat(res, "email", check.message, refs);
                            break;
                        case "format:idn-email":
                            addFormat(res, "idn-email", check.message, refs);
                            break;
                        case "pattern:zod":
                            addPattern(res, exports.emailPattern, check.message, refs);
                            break;
                    }
                    break;
                case "url":
                    addFormat(res, "uri", check.message, refs);
                    break;
                case "uuid":
                    addFormat(res, "uuid", check.message, refs);
                    break;
                case "regex":
                    addPattern(res, check.regex.source, check.message, refs);
                    break;
                case "cuid":
                    addPattern(res, exports.cuidPattern, check.message, refs);
                    break;
                case "cuid2":
                    addPattern(res, exports.cuid2Pattern, check.message, refs);
                    break;
                case "startsWith":
                    addPattern(res, "^" + escapeNonAlphaNumeric(check.value), check.message, refs);
                    break;
                case "endsWith":
                    addPattern(res, escapeNonAlphaNumeric(check.value) + "$", check.message, refs);
                    break;
                case "datetime":
                    addFormat(res, "date-time", check.message, refs);
                    break;
                case "length":
                    (0, errorMessages_1.setResponseValueAndErrors)(res, "minLength", typeof res.minLength === "number"
                        ? Math.max(res.minLength, check.value)
                        : check.value, check.message, refs);
                    (0, errorMessages_1.setResponseValueAndErrors)(res, "maxLength", typeof res.maxLength === "number"
                        ? Math.min(res.maxLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "includes": {
                    addPattern(res, escapeNonAlphaNumeric(check.value), check.message, refs);
                    break;
                }
                case "ip": {
                    if (check.version !== "v6") {
                        addFormat(res, "ipv4", check.message, refs);
                    }
                    if (check.version !== "v4") {
                        addFormat(res, "ipv6", check.message, refs);
                    }
                    break;
                }
                case "emoji":
                    addPattern(res, exports.emojiPattern, check.message, refs);
                    break;
                case "ulid": {
                    addPattern(res, exports.ulidPattern, check.message, refs);
                    break;
                }
                case "toLowerCase":
                case "toUpperCase":
                case "trim":
                    // I have no idea why these are checks in Zod 🤷
                    break;
                default:
                    ((_) => { })(check);
            }
        }
    }
    return res;
}
exports.parseStringDef = parseStringDef;
const escapeNonAlphaNumeric = (value) => Array.from(value)
    .map((c) => (/[a-zA-Z0-9]/.test(c) ? c : `\\${c}`))
    .join("");
const addFormat = (schema, value, message, refs) => {
    var _a;
    if (schema.format || ((_a = schema.anyOf) === null || _a === void 0 ? void 0 : _a.some((x) => x.format))) {
        if (!schema.anyOf) {
            schema.anyOf = [];
        }
        if (schema.format) {
            schema.anyOf.push(Object.assign({ format: schema.format }, (schema.errorMessage &&
                refs.errorMessages && {
                errorMessage: { format: schema.errorMessage.format },
            })));
            delete schema.format;
            if (schema.errorMessage) {
                delete schema.errorMessage.format;
                if (Object.keys(schema.errorMessage).length === 0) {
                    delete schema.errorMessage;
                }
            }
        }
        schema.anyOf.push(Object.assign({ format: value }, (message &&
            refs.errorMessages && { errorMessage: { format: message } })));
    }
    else {
        (0, errorMessages_1.setResponseValueAndErrors)(schema, "format", value, message, refs);
    }
};
const addPattern = (schema, value, message, refs) => {
    var _a;
    if (schema.pattern || ((_a = schema.allOf) === null || _a === void 0 ? void 0 : _a.some((x) => x.pattern))) {
        if (!schema.allOf) {
            schema.allOf = [];
        }
        if (schema.pattern) {
            schema.allOf.push(Object.assign({ pattern: schema.pattern }, (schema.errorMessage &&
                refs.errorMessages && {
                errorMessage: { pattern: schema.errorMessage.pattern },
            })));
            delete schema.pattern;
            if (schema.errorMessage) {
                delete schema.errorMessage.pattern;
                if (Object.keys(schema.errorMessage).length === 0) {
                    delete schema.errorMessage;
                }
            }
        }
        schema.allOf.push(Object.assign({ pattern: value }, (message &&
            refs.errorMessages && { errorMessage: { pattern: message } })));
    }
    else {
        (0, errorMessages_1.setResponseValueAndErrors)(schema, "pattern", value, message, refs);
    }
};