"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  jsonStructureFromAirNode: () => jsonStructureFromAirNode,
  jsonStructureFromFunction: () => jsonStructureFromFunction,
  jsonStructureFromNodeIndex: () => jsonStructureFromNodeIndex
});
module.exports = __toCommonJS(src_exports);

// src/src/jsonStructureFromFunction.ts
var import_ts_morph = require("ts-morph");
var import_path = __toESM(require("path"), 1);
var import_ts_json_schema_generator = require("ts-json-schema-generator");
var jsonStructureFromFunction = async (fn) => {
  const project = new import_ts_morph.Project();
  const sourceFile = project.addSourceFileAtPath(import_path.default.resolve(process.cwd(), "bin", "type-index.d.ts"));
  const variableDeclarationNode = sourceFile.getVariableDeclarationOrThrow(fn.name);
  const variableStatementNode = variableDeclarationNode.getParentOrThrow().getParentOrThrow();
  const description = variableStatementNode.getJsDocs()[0]?.getComment() ?? `${fn.name}`;
  const functionTypeNode = variableDeclarationNode.getTypeNodeOrThrow();
  const inputObject = functionTypeNode.getParameters()[0];
  const returnType = functionTypeNode.getReturnType();
  if (sourceFile.getTypeAlias(`${fn.name}_Input`) === void 0) {
    sourceFile.addTypeAliases([{
      name: `${fn.name}_Input`,
      type: inputObject.getType().getText(),
      isExported: true
    }, {
      name: `${fn.name}_Output`,
      type: returnType.getText(),
      isExported: true
    }]).forEach((typeAlias) => {
      const nodeMatchVisitor = (aliasNode, matchNode) => {
        if (aliasNode.getKindName() === "PropertySignature" && aliasNode.getText().includes(matchNode.getText())) {
          aliasNode.addJsDoc({
            description: ``
          });
          aliasNode.addJsDoc({
            //@ts-ignore
            description: `
${matchNode.getJsDocs()[0]?.getComment()}`
          });
        }
        aliasNode.forEachChild((aliasNodeChild) => {
          nodeMatchVisitor(aliasNodeChild, matchNode);
        });
      };
      const visitor = (node) => {
        if (node.getKindName() === "PropertySignature" && node.getJsDocs()[0]?.getComment()) {
          typeAlias.forEachChild((aliasNode) => {
            nodeMatchVisitor(aliasNode, node);
          });
        }
        node.forEachChild(visitor);
      };
      inputObject.forEachChild((node) => {
        visitor(node);
      });
    });
    await sourceFile.save();
  }
  const inputSchema = (0, import_ts_json_schema_generator.createGenerator)({
    path: import_path.default.resolve(process.cwd(), "bin", "type-index.d.ts"),
    tsconfig: import_path.default.resolve(__dirname, "../tsconfig.json"),
    type: `${fn.name}_Input`
  }).createSchema(`${fn.name}_Input`);
  const outputSchema = (0, import_ts_json_schema_generator.createGenerator)({
    path: import_path.default.resolve(process.cwd(), "bin", "type-index.d.ts"),
    tsconfig: import_path.default.resolve(__dirname, "../tsconfig.json"),
    type: `${fn.name}_Output`
  }).createSchema(`${fn.name}_Output`);
  return {
    name: fn.name,
    description,
    input: inputSchema.definitions[`${fn.name}_Input`],
    output: outputSchema.definitions[`${fn.name}_Output`]
  };
};

// src/src/schemaFromTypeName.ts
var import_path2 = __toESM(require("path"), 1);
var import_ts_json_schema_generator2 = require("ts-json-schema-generator");
var schemaFromTypeName = (typeName) => (0, import_ts_json_schema_generator2.createGenerator)({
  path: import_path2.default.resolve(process.cwd(), "bin", "type-index.d.ts"),
  tsconfig: process.env.NODE_ENV === "cli-dev" ? import_path2.default.resolve(process.cwd(), "dist", "tsconfig.json") : import_path2.default.resolve(__dirname, "tsconfig.json"),
  type: typeName,
  expose: "all"
}).createSchema(typeName);

// src/src/jsonStructureFromAirNode.ts
var jsonStructureFromAirNode = (nodeName) => {
  const nodeSchema = schemaFromTypeName(nodeName);
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
  const nodeDescription = nodeSchema.definitions[nodeName].description;
  const valueSchema = findValueNode(nodeSchema.definitions);
  return {
    name: nodeName,
    description: nodeDescription,
    structure: valueSchema
  };
};

// src/src/jsonStructureFromNodeIndex.ts
var jsonStructureFromNodeIndex = (indexName) => {
  const indexSchema = schemaFromTypeName(indexName);
  const definitions = indexSchema.definitions;
  const index = Object.fromEntries(
    Object.entries(definitions).filter(([key]) => {
      const match = key.match(/<([^>]+)>/);
      return match && match.length > 0 ? true : false;
    }).map(([key, value]) => {
      const match = key.match(/<([^>]+)>/)[1];
      return [
        key.match(/<([^>]+)>/)[1],
        {
          name: match,
          description: definitions[indexName].properties[match]?.description ?? "",
          structure: value
        }
      ];
    })
  );
  return {
    name: indexName,
    description: definitions[indexName].description,
    index
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  jsonStructureFromAirNode,
  jsonStructureFromFunction,
  jsonStructureFromNodeIndex
});
