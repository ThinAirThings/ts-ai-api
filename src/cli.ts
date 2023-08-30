import {program} from '@commander-js/extra-typings';
import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import { createGenerator } from 'ts-json-schema-generator';



program
    .name("ts-ai-json").version("0.0.1").description("Convert typescript files to json schema")
    .option("-d, --directory <projectDirectory>", "Path to the project directory")
    .option("-t, --tsconfig <tsconfig>", "Path to the tsconfig.json file")
    .option("-o, --output <output>", "Path to the output file")
    .action(async (options) => {
        // Get list of ai files
        
        const aiApiDirectories = await glob(
            path.join(path.resolve(options.directory??'.'), '**','*.aiApi')
        )
        console.log(aiApiDirectories)
        aiApiDirectories.forEach(async (apiDirectory) => {
            const aiDirectoryObject = {
                apiName: '',
                description: '',
                functions: {} as Record<string, object>
            }
            aiDirectoryObject.apiName = path.basename(apiDirectory.replace('.aiApi', ''))
            aiDirectoryObject.description = await readFile(path.join(apiDirectory, 'description.ai'), 'utf8')
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
                        properties: Record<Useless, object> 
                    }
                    aiDirectoryObject.functions[key.match(/NamedParameters<typeof (.*?)>/)![1]] = Object.values(value.properties)[0]
                })
            })
            await writeFile(
                path.join(path.resolve('.'), options.output??'dist', 'aiApis', `${aiDirectoryObject.apiName}.json`), 
                JSON.stringify(aiDirectoryObject, null, 4)
            )
        })
    })

program.parse()

