// src/src/jsonStructureFromFunction.ts
import { Project } from "ts-morph";
import path from "path";
import { createGenerator } from "ts-json-schema-generator";
var jsonStructureFromFunction = async (fn) => {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(path.resolve(process.cwd(), "bin", "type-index.d.ts"));
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
  const inputSchema = createGenerator({
    path: path.resolve(process.cwd(), "bin", "type-index.d.ts"),
    // tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    type: `${fn.name}_Input`
  }).createSchema(`${fn.name}_Input`);
  const outputSchema = createGenerator({
    path: path.resolve(process.cwd(), "bin", "type-index.d.ts"),
    // tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    type: `${fn.name}_Output`
  }).createSchema(`${fn.name}_Output`);
  return {
    name: fn.name,
    description,
    input: inputSchema.definitions[`${fn.name}_Input`],
    output: outputSchema.definitions[`${fn.name}_Output`]
  };
};
export {
  jsonStructureFromFunction
};
