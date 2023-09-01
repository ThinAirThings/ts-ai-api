import {FunctionTypeNode, Project, VariableStatement} from 'ts-morph'
import path from "path";
import { createGenerator } from 'ts-json-schema-generator';



// Note: This is currently slow. But it works.
// You need to add in the ability to use parameter descriptions
export const getFunctionParameters = async (fn: Function): Promise<{
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
    const params = functionTypeNode.getParameters()[0].getType().getProperties()[0].getValueDeclaration()?.getType()
    const returnType = functionTypeNode.getReturnType()
    sourceFile.addTypeAliases([{
        name: `${fn.name}Params`,
        type: params?.getText()!,
        isExported: true
    }, {
        name: `${fn.name}ReturnType`,
        type: returnType.getText()!,
        isExported: true
    }]).forEach((typeAlias, index) => {
        // YOURE HERE. Need to figure out how to add parameter descriptions
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