#!/usr/bin/env node

// src/cli.ts
import { program } from "@commander-js/extra-typings";
import { readFile, writeFile, mkdir } from "fs/promises";
import { glob } from "glob";
import path from "path";
import { createGenerator } from "ts-json-schema-generator";
program.name("ts-ai-api").version("0.0.1").description("Convert typescript files to json schema");
program.command("create-api").option("-d, --directory <projectDirectory>", "Path to the project directory").option("-t, --tsconfig <tsconfig>", "Path to the tsconfig.json file").option("-o, --output <output>", "Path to the output file").action(async (options) => {
  const aiApiDirectories = await glob(
    path.join(path.resolve(options.directory ?? "."), "**", "*.ai")
  );
  aiApiDirectories.forEach(async (apiDirectory) => {
    const aiDirectoryObject = {
      apiName: "",
      description: "",
      functions: {}
    };
    aiDirectoryObject.apiName = path.basename(apiDirectory.replace(".ai", ""));
    aiDirectoryObject.description = await readFile(path.join(apiDirectory, "api-description.txt"), "utf8");
    const aiFunctions = await glob([
      path.join(apiDirectory, "**", "*.ai.ts"),
      path.join(apiDirectory, "**", "*.ai.tsx")
    ]);
    aiFunctions.forEach(async (aiFunction) => {
      const rawSchema = createGenerator({
        path: aiFunction,
        tsconfig: options.tsconfig ?? path.join(path.resolve("."), "tsconfig.json"),
        type: "*"
      }).createSchema("*");
      await writeFile(path.join(apiDirectory, `${path.basename(aiFunction)}-raw.json`), JSON.stringify(rawSchema, null, 4));
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
    const outputDir = options.output ? path.join(path.resolve("."), options.output) : apiDirectory;
    await mkdir(outputDir, { recursive: true });
    await writeFile(
      path.join(outputDir, `${aiDirectoryObject.apiName}.json`),
      JSON.stringify(aiDirectoryObject, null, 4)
    );
  });
});
program.command("generate-interfaces").option("-d, --directory <projectDirectory>", "Path to the project directory").option("-o, --output <output>", "Path to the output file").action(async (options) => {
  const aiApiDirectories = await glob(
    path.join(path.resolve(options.directory ?? "."), "**", "*.ai")
  );
  aiApiDirectories.forEach(async (apiDirectory) => {
    const aiFunctions = await glob([
      path.join(apiDirectory, "**", "*.ai.ts")
    ]);
    aiFunctions.forEach(async (aiFunction) => {
      const functionSchema = createGenerator({
        path: aiFunction,
        tsconfig: path.join(path.resolve("."), "tsconfig.json"),
        type: "*"
      }).createSchema("*");
      await writeFile(
        path.join(apiDirectory, `${path.basename(aiFunction)}-raw.json`),
        JSON.stringify(functionSchema, null, 4)
      );
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
      await writeFile(
        path.join(apiDirectory, `${functionName}.ai.json`),
        JSON.stringify(functionJson, null, 4)
      );
    });
  });
});
program.parse();
