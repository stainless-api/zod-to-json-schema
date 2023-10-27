import { ZodSchema } from "zod";
export type Targets = "jsonSchema7" | "jsonSchema2019-09" | "openApi3";
export type Options<Target extends Targets = "jsonSchema7"> = {
    name: string | undefined;
    $refStrategy: "root" | "relative" | "none" | "seen";
    basePath: string[];
    effectStrategy: "input" | "any";
    pipeStrategy: "input" | "all";
    dateStrategy: "string" | "integer";
    target: Target;
    strictUnions: boolean;
    definitionPath: string;
    definitions: Record<string, ZodSchema>;
    errorMessages: boolean;
    markdownDescription: boolean;
    emailStrategy: "format:email" | "format:idn-email" | "pattern:zod";
};
export declare const defaultOptions: Options;
export declare const getDefaultOptions: <Target extends Targets>(options: string | Partial<Options<Target>> | undefined) => Options<Target>;
