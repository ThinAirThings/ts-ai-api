import { AirNode, NodeValue } from "@thinairthings/react-nodegraph"
import path from "path"
import { createGenerator } from "ts-json-schema-generator"

/** This is a test node */
export type TestNode = AirNode<{
    /** This is a name */
    name: string,
    /** This is a shape */
    shape: {[key: string]: any}
    thing: number
}, 'someNode'>

export const jsonStructureFromAirNode = async (
    nodeName: string
) => {
    const nodeSchema = createGenerator({
        path: path.resolve(process.cwd(), 'bin', 'type-index.d.ts'),
        // tsconfig: path.resolve(__dirname, '../tsconfig.json'),
        type: nodeName,
        expose: 'all',
    }).createSchema(nodeName)
    const findValueNode = (node: Record<string, any>): any => {
        if (typeof node !== 'object' || node === null) {
            return undefined;
        }

        if (Object.keys(node).includes("value")) {
            return node.value;
        } else {
            for (const childNode of Object.values(node)) {
                const result = findValueNode(childNode);
                if (result !== undefined) {
                    return result;
                }
            }
        }
        return undefined;
    }
    const nodeDescription = (nodeSchema.definitions!['TestNode']! as any).description
    const valueSchema = findValueNode(nodeSchema.definitions!)
    return {
        name: nodeName,
        description: nodeDescription,
        structure: valueSchema 
    }
}