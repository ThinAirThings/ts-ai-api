#!/bin/env node
import {program} from '@commander-js/extra-typings';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import { createGenerator } from 'ts-json-schema-generator';
import { jsonStructureFromAirNode } from './src/jsonStructureFromAirNode.js';
import { jsonStructureFromNodeIndex } from './src/jsonStructureFromNodeIndex.js';

export type AiApiJSON = {
    apiName: string,
    description: string,
    functions: Record<string, {
        name: string,
        description: string,
        parameters: Record<string, any>
    }>
}

program
    .name("ts-ai-api").version("0.0.1").description("Convert typescript files to json schema")

program
    .command("create-api")
    .option("-d, --directory <projectDirectory>", "Path to the project directory")
    .option("-t, --tsconfig <tsconfig>", "Path to the tsconfig.json file")
    .option("-o, --output <output>", "Path to the output file")
    .action(async (options) => {
        // Get list of ai files 
        const aiApiDirectories = await glob(
            path.join(path.resolve(options.directory??'.'), '**','*.ai')
        )
        aiApiDirectories.forEach(async (apiDirectory) => {
            const aiDirectoryObject: AiApiJSON = {
                apiName: '',
                description: '',
                functions: {} as Record<string, any>
            }
            aiDirectoryObject.apiName = path.basename(apiDirectory.replace('.ai', ''))
            aiDirectoryObject.description = await readFile(path.join(apiDirectory, 'api-description.txt'), 'utf8')
            const aiFunctions = await glob([
                path.join(apiDirectory, '**', '*.ai.ts'),
                path.join(apiDirectory, '**', '*.ai.tsx')
            ])
            aiFunctions.forEach(async (aiFunction) => {
                const rawSchema = createGenerator({
                    path: aiFunction,
                    tsconfig: options.tsconfig??path.join(path.resolve('.'), 'tsconfig.json'),
                    type: '*'
                }).createSchema('*')
                await writeFile( path.join(apiDirectory, `${path.basename(aiFunction)}-raw.json`), JSON.stringify(rawSchema, null, 4))
                Object.entries(rawSchema.definitions!).forEach(([key, _value]) => {
                    type Useless = string
                    const value = _value as {
                        type: "object",
                        properties: Record<Useless, {
                            type: "object",
                            properties: Record<string, any>
                            description?: string
                        }> 
                    }
                    const functionJsonDeclaration = Object.values(value.properties)[0]
                    const functionDescription = functionJsonDeclaration.description
                    delete functionJsonDeclaration.description
                    aiDirectoryObject.functions[key.match(/NamedParameters<typeof (.*?)>/)![1]] = {
                        name: key.match(/NamedParameters<typeof (.*?)>/)![1],
                        description: functionDescription??'',
                        parameters: functionJsonDeclaration
                    }
                })
            })
            const outputDir = options.output 
                ? path.join(path.resolve('.'), options.output)
                : apiDirectory
            await mkdir(outputDir, { recursive: true })
            await writeFile(
                path.join(outputDir, `${aiDirectoryObject.apiName}.json`), 
                JSON.stringify(aiDirectoryObject, null, 4)
            )
        })
    })

program
    .command("generate-interfaces")
    .option("-d, --directory <projectDirectory>", "Path to the project directory")
    .option("-o, --output <output>", "Path to the output file")
    .action(async (options) => {
        // Get list of ai files 
        const aiApiDirectories = await glob(
            path.join(path.resolve(options.directory??'.'), '**','*.ai?(.api)')
        )
        aiApiDirectories.forEach(async (apiDirectory) => {
            const aiFunctions = await glob([
                path.join(apiDirectory, '**', '*.ai.ts'),
            ])
            aiFunctions.forEach(async (aiFunction) => {
                const functionSchema = createGenerator({
                    path: aiFunction,
                    tsconfig: path.join(path.resolve('.'), 'tsconfig.json'),
                    type: '*',
                    skipTypeCheck: true
                }).createSchema('*')
                // Create Function JSon structure
                const functionJson: {
                    name: string
                    description: string,
                    input: Record<string, any>,
                    output: Record<string, any>
                } = {} as any
                // Create entry for function
                const functionName= Object.entries(functionSchema.definitions!)
                    .filter(([key]) => key.includes('NamedParameters'))
                    .map(([key]) => key.match(/NamedParameters<typeof (.*?)>/)![1])[0]
                const functionDescription = Object.entries(functionSchema.definitions!)
                    .filter(([key]) => key.includes('NamedParameters'))
                    .map(([_namedParamKey, value]) => {
                        return (Object.values((value as any).properties)[0]! as any).description
                    })[0]
                functionJson['name'] = functionName
                functionJson['description'] = functionDescription
                Object.entries(functionSchema.definitions!).filter(([key]) => (
                    (key === '_Input') || (key === '_Output')
                )).forEach(([key, value]) => {
                    if (key === '_Input') {
                        functionJson['input'] = value as Record<string, any>
                    } else {
                        functionJson['output'] = value as Record<string, any>
                    }
                })
                await writeFile( 
                    path.join(path.dirname(aiFunction), `${functionName}.ai.json`), 
                    JSON.stringify(functionJson, null, 4)
                )
            })
        })
    })

program
    .command("test")
    .action(async () => {
    //    const params = await jsonStructureFromFunction(testFn2)
        // const params = jsonStructureFromAirNode('ResolutionOutputNode')
        const params = jsonStructureFromNodeIndex('GoalNodeIndex')
       console.log(JSON.stringify(params, null, 4))
    })
program.parse()



