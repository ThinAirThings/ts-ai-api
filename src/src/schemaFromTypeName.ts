import path from "path";
import { createGenerator } from "ts-json-schema-generator";


export const schemaFromTypeName = (typeName: string) => createGenerator({
    path: path.resolve(process.cwd(), 'bin', 'type-index.d.ts'),
    tsconfig: process.env.NODE_ENV === 'cli-dev' 
        ? path.resolve(process.cwd(), 'dist', 'tsconfig.json')
        : path.resolve(__dirname, 'tsconfig.json'),
    type: typeName,
    expose: 'all',
}).createSchema(typeName)