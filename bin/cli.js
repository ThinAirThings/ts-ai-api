#!/bin/env node

// node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/cli.ts
import { program } from "@commander-js/extra-typings";
import { readFile, writeFile, mkdir } from "fs/promises";
import { glob } from "glob";
import path3 from "path";
import { createGenerator as createGenerator2 } from "ts-json-schema-generator";

// src/src/jsonStructureFromNode.ts
import path2 from "path";
import { createGenerator } from "ts-json-schema-generator";
import { Project } from "ts-morph";
var jsonStructureFromAirNode = async (nodeName) => {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(
    path2.resolve(process.cwd(), "bin", "type-index.d.ts")
  );
  const typeDeclarationNode = sourceFile.getTypeAliasOrThrow(nodeName);
  const nodeSchema = createGenerator({
    path: path2.resolve(process.cwd(), "bin", "type-index.d.ts"),
    tsconfig: path2.resolve(__dirname, "../tsconfig.json"),
    type: nodeName,
    expose: "all"
  }).createSchema(nodeName);
  const findValueNode = (node) => {
    if (typeof node !== "object" || node === null) {
      return void 0;
    }
    if (Object.keys(node).includes("value")) {
      return node.value;
    } else {
      for (const childNode of Object.values(node)) {
        const result = findValueNode(childNode);
        if (result !== void 0) {
          return result;
        }
      }
    }
    return void 0;
  };
  const nodeDescription = nodeSchema.definitions["TestNode"].description;
  const valueSchema = findValueNode(nodeSchema.definitions);
  return {
    name: nodeName,
    description: nodeDescription,
    structure: valueSchema
  };
};

// src/cli.ts
program.name("ts-ai-api").version("0.0.1").description("Convert typescript files to json schema");
program.command("create-api").option("-d, --directory <projectDirectory>", "Path to the project directory").option("-t, --tsconfig <tsconfig>", "Path to the tsconfig.json file").option("-o, --output <output>", "Path to the output file").action(async (options) => {
  const aiApiDirectories = await glob(
    path3.join(path3.resolve(options.directory ?? "."), "**", "*.ai")
  );
  aiApiDirectories.forEach(async (apiDirectory) => {
    const aiDirectoryObject = {
      apiName: "",
      description: "",
      functions: {}
    };
    aiDirectoryObject.apiName = path3.basename(apiDirectory.replace(".ai", ""));
    aiDirectoryObject.description = await readFile(path3.join(apiDirectory, "api-description.txt"), "utf8");
    const aiFunctions = await glob([
      path3.join(apiDirectory, "**", "*.ai.ts"),
      path3.join(apiDirectory, "**", "*.ai.tsx")
    ]);
    aiFunctions.forEach(async (aiFunction) => {
      const rawSchema = createGenerator2({
        path: aiFunction,
        tsconfig: options.tsconfig ?? path3.join(path3.resolve("."), "tsconfig.json"),
        type: "*"
      }).createSchema("*");
      await writeFile(path3.join(apiDirectory, `${path3.basename(aiFunction)}-raw.json`), JSON.stringify(rawSchema, null, 4));
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
    const outputDir = options.output ? path3.join(path3.resolve("."), options.output) : apiDirectory;
    await mkdir(outputDir, { recursive: true });
    await writeFile(
      path3.join(outputDir, `${aiDirectoryObject.apiName}.json`),
      JSON.stringify(aiDirectoryObject, null, 4)
    );
  });
});
program.command("generate-interfaces").option("-d, --directory <projectDirectory>", "Path to the project directory").option("-o, --output <output>", "Path to the output file").action(async (options) => {
  const aiApiDirectories = await glob(
    path3.join(path3.resolve(options.directory ?? "."), "**", "*.ai?(.api)")
  );
  aiApiDirectories.forEach(async (apiDirectory) => {
    const aiFunctions = await glob([
      path3.join(apiDirectory, "**", "*.ai.ts")
    ]);
    aiFunctions.forEach(async (aiFunction) => {
      const functionSchema = createGenerator2({
        path: aiFunction,
        tsconfig: path3.join(path3.resolve("."), "tsconfig.json"),
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
      await writeFile(
        path3.join(path3.dirname(aiFunction), `${functionName}.ai.json`),
        JSON.stringify(functionJson, null, 4)
      );
    });
  });
});
program.command("test").action(async () => {
  const params = await jsonStructureFromAirNode("TestNode");
  console.log(JSON.stringify(params, null, 4));
});
program.parse();
