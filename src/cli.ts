import {program} from '@commander-js/extra-typings';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import { createGenerator } from 'ts-json-schema-generator';


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
    .name("ts-ai-json").version("0.0.1").description("Convert typescript files to json schema")
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
            const aiFunctions = await glob(
                path.join(apiDirectory, '**', '*.ai.ts')
            )
            aiFunctions.forEach(async (aiFunction) => {
                const rawSchema = createGenerator({
                    path: aiFunction,
                    tsconfig: options.tsconfig??path.join(path.resolve('.'), 'tsconfig.json'),
                    type: '*'
                }).createSchema('*')
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

program.parse()



