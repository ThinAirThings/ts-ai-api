// node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/src/jsonInputStructureFromFunction.ts
import { Project } from "ts-morph";
import path2 from "path";
import { createGenerator } from "ts-json-schema-generator";
var jsonInputStructureFromFunction = async (fn) => {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(path2.resolve(process.cwd(), "./type-index.d.ts"));
  const variableDeclarationNode = sourceFile.getVariableDeclarationOrThrow(fn.name);
  const variableStatementNode = variableDeclarationNode.getParentOrThrow().getParentOrThrow();
  const description = variableStatementNode.getJsDocs()[0]?.getComment() ?? `${fn.name}`;
  const functionTypeNode = variableDeclarationNode.getTypeNodeOrThrow();
  const inputObject = functionTypeNode.getParameters()[0];
  const returnType = functionTypeNode.getReturnType();
  sourceFile.addTypeAliases([{
    name: `${fn.name}Params`,
    type: inputObject.getType().getText(),
    isExported: true
  }, {
    name: `${fn.name}ReturnType`,
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
  const schema = createGenerator({
    path: path2.resolve(__dirname, "./type-index.d.ts"),
    tsconfig: path2.resolve(__dirname, "../tsconfig.json"),
    type: `${fn.name}Params`
  }).createSchema(`${fn.name}Params`);
  return {
    name: fn.name,
    description,
    parameters: schema.definitions[`${fn.name}Params`]
  };
};
export {
  jsonInputStructureFromFunction
};
