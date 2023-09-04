import {FunctionTypeNode, Node, Project, SyntaxKind, Type, TypeLiteralNode, VariableStatement} from 'ts-morph'
import path from "path";
import { createGenerator, ts } from 'ts-json-schema-generator';


// Note: This is currently slow. But it works.
// You need to add in the ability to use parameter descriptions
export const jsonStructureFromFunction = async (fn: Function): Promise<{
    name: string,
    description: string,
    input: Record<string, any>
    output: Record<string, any>
}> => {
    const project = new Project()
    const sourceFile = project.addSourceFileAtPath(path.resolve(process.cwd(), 'bin', 'type-index.d.ts'))
    
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
    if (sourceFile.getTypeAlias(`${fn.name}_Input`) === undefined) {
        sourceFile.addTypeAliases([{
            name: `${fn.name}_Input`,
            type: inputObject.getType().getText()!,
            isExported: true
        }, {
            name: `${fn.name}_Output`,
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
    }
    
    // Create Input Schema
    const inputSchema = createGenerator({
        path: path.resolve(process.cwd(), 'bin', 'type-index.d.ts'),
        // tsconfig: path.resolve(__dirname, '../tsconfig.json'),
        type: `${fn.name}_Input`,
    }).createSchema(`${fn.name}_Input`)
    // Create Output Schema
    const outputSchema = createGenerator({
        path: path.resolve(process.cwd(), 'bin', 'type-index.d.ts'),
        // tsconfig: path.resolve(__dirname, '../tsconfig.json'),
        type: `${fn.name}_Output`,
    }).createSchema(`${fn.name}_Output`)
    return {
        name: fn.name,
        description: description as string,
        input: inputSchema.definitions![`${fn.name}_Input`]! as Record<string, any>,
        output: outputSchema.definitions![`${fn.name}_Output`]! as Record<string, any>
    }
}