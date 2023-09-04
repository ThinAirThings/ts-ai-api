import {FunctionTypeNode, Node, Project, SyntaxKind, Type, TypeLiteralNode, VariableStatement} from 'ts-morph'
import path from "path";
import { createGenerator, ts } from 'ts-json-schema-generator';



// Note: This is currently slow. But it works.
// You need to add in the ability to use parameter descriptions
export const jsonInputStructureFromFunction = async (fn: Function): Promise<{
    name: string,
    description: string,
    parameters: Record<string, any>
}> => {
    const project = new Project()
    const sourceFile = project.addSourceFileAtPath(path.resolve(__dirname, './type-index.d.ts'))
    // Get Target Variable
    const variableDeclarationNode = sourceFile
        .getVariableDeclarationOrThrow(fn.name)
    // Get Function Description
    const variableStatementNode = variableDeclarationNode.getParentOrThrow().getParentOrThrow() as VariableStatement
    // If no description, use function name
    const description = variableStatementNode.getJsDocs()[0]?.getComment()??`${fn.name}`
    // Get function type node
    const functionTypeNode = variableDeclarationNode
        .getTypeNodeOrThrow() as FunctionTypeNode
    const inputObject = functionTypeNode.getParameters()[0]

    // Return Type
    const returnType = functionTypeNode.getReturnType()
    sourceFile.addTypeAliases([{
        name: `${fn.name}Params`,
        type: inputObject.getType().getText()!,
        isExported: true
    }, {
        name: `${fn.name}ReturnType`,
        type: returnType.getText()!,
        isExported: true
    }]).forEach((typeAlias) => {
        const nodeMatchVisitor = (aliasNode: Node<ts.Node>, matchNode: Node<ts.Node>) => {
            if (aliasNode.getKindName()==="PropertySignature" && aliasNode.getText().includes(matchNode.getText())) {
                // @ts-ignore
                aliasNode.addJsDoc({
                    description: ``
                })
                // @ts-ignore
                aliasNode.addJsDoc({
                    //@ts-ignore
                    description: `\n${matchNode.getJsDocs()[0]?.getComment()}`
                })
            }
            aliasNode.forEachChild(aliasNodeChild => {
                nodeMatchVisitor(aliasNodeChild, matchNode)
            })
        }
        const visitor = (node: Node<ts.Node>)  => {
            //@ts-ignore
            if (node.getKindName() === "PropertySignature" && (node.getJsDocs()[0]?.getComment())) {
                typeAlias.forEachChild((aliasNode) => {
                    nodeMatchVisitor(aliasNode, node)
                })
            }
            node.forEachChild(visitor)
        }
        inputObject.forEachChild((node) => {
            visitor(node)
        })
    })
    await sourceFile.save()
    const schema = createGenerator({
        path: path.resolve(__dirname, './type-index.d.ts'),
        tsconfig: path.resolve(__dirname, '../tsconfig.json'),
        type: `${fn.name}Params`,
    }).createSchema(`${fn.name}Params`)
    return {
        name: fn.name,
        description: description as string,
        parameters: schema.definitions![`${fn.name}Params`]! as Record<string, any>
    }
}