#!/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/cli.ts
var cli_exports = {};
module.exports = __toCommonJS(cli_exports);
var import_extra_typings = require("@commander-js/extra-typings");
var import_promises = require("fs/promises");
var import_glob = require("glob");
var import_path = __toESM(require("path"), 1);
var import_ts_json_schema_generator = require("ts-json-schema-generator");
import_extra_typings.program.name("ts-ai-api").version("0.0.1").description("Convert typescript files to json schema");
import_extra_typings.program.command("create-api").option("-d, --directory <projectDirectory>", "Path to the project directory").option("-t, --tsconfig <tsconfig>", "Path to the tsconfig.json file").option("-o, --output <output>", "Path to the output file").action(async (options) => {
  const aiApiDirectories = await (0, import_glob.glob)(
    import_path.default.join(import_path.default.resolve(options.directory ?? "."), "**", "*.ai")
  );
  aiApiDirectories.forEach(async (apiDirectory) => {
    const aiDirectoryObject = {
      apiName: "",
      description: "",
      functions: {}
    };
    aiDirectoryObject.apiName = import_path.default.basename(apiDirectory.replace(".ai", ""));
    aiDirectoryObject.description = await (0, import_promises.readFile)(import_path.default.join(apiDirectory, "api-description.txt"), "utf8");
    const aiFunctions = await (0, import_glob.glob)([
      import_path.default.join(apiDirectory, "**", "*.ai.ts"),
      import_path.default.join(apiDirectory, "**", "*.ai.tsx")
    ]);
    aiFunctions.forEach(async (aiFunction) => {
      const rawSchema = (0, import_ts_json_schema_generator.createGenerator)({
        path: aiFunction,
        tsconfig: options.tsconfig ?? import_path.default.join(import_path.default.resolve("."), "tsconfig.json"),
        type: "*"
      }).createSchema("*");
      await (0, import_promises.writeFile)(import_path.default.join(apiDirectory, `${import_path.default.basename(aiFunction)}-raw.json`), JSON.stringify(rawSchema, null, 4));
      Object.entries(rawSchema.definitions).forEach(([key, _value]) => {
        const value = _value;
        const functionJsonDeclaration = Object.values(value.properties)[0];
        const functionDescription = functionJsonDeclaration.description;
        delete functionJsonDeclaration.description;
        aiDirectoryObject.functions[key.match(/NamedParameters<typeof (.*?)>/)[1]] = {
          name: key.match(/NamedParameters<typeof (.*?)>/)[1],
          description: functionDescription ?? "",
          parameters: functionJsonDeclaration
        };
      });
    });
    const outputDir = options.output ? import_path.default.join(import_path.default.resolve("."), options.output) : apiDirectory;
    await (0, import_promises.mkdir)(outputDir, { recursive: true });
    await (0, import_promises.writeFile)(
      import_path.default.join(outputDir, `${aiDirectoryObject.apiName}.json`),
      JSON.stringify(aiDirectoryObject, null, 4)
    );
  });
});
import_extra_typings.program.command("generate-interfaces").option("-d, --directory <projectDirectory>", "Path to the project directory").option("-o, --output <output>", "Path to the output file").action(async (options) => {
  const aiApiDirectories = await (0, import_glob.glob)(
    import_path.default.join(import_path.default.resolve(options.directory ?? "."), "**", "*.ai?(.api)")
  );
  aiApiDirectories.forEach(async (apiDirectory) => {
    const aiFunctions = await (0, import_glob.glob)([
      import_path.default.join(apiDirectory, "**", "*.ai.ts")
    ]);
    aiFunctions.forEach(async (aiFunction) => {
      const functionSchema = (0, import_ts_json_schema_generator.createGenerator)({
        path: aiFunction,
        tsconfig: import_path.default.join(import_path.default.resolve("."), "tsconfig.json"),
        type: "*",
        skipTypeCheck: true
      }).createSchema("*");
      const functionJson = {};
      const functionName = Object.entries(functionSchema.definitions).filter(([key]) => key.includes("NamedParameters")).map(([key]) => key.match(/NamedParameters<typeof (.*?)>/)[1])[0];
      const functionDescription = Object.entries(functionSchema.definitions).filter(([key]) => key.includes("NamedParameters")).map(([_namedParamKey, value]) => {
        return Object.values(value.properties)[0].description;
      })[0];
      functionJson["name"] = functionName;
      functionJson["description"] = functionDescription;
      Object.entries(functionSchema.definitions).filter(([key]) => key === "_Input" || key === "_Output").forEach(([key, value]) => {
        if (key === "_Input") {
          functionJson["input"] = value;
        } else {
          functionJson["output"] = value;
        }
      });
      await (0, import_promises.writeFile)(
        import_path.default.join(import_path.default.dirname(aiFunction), `${functionName}.ai.json`),
        JSON.stringify(functionJson, null, 4)
      );
    });
  });
});
import_extra_typings.program.command("test").action(() => {
  console.log("Hello");
});
import_extra_typings.program.parse();
