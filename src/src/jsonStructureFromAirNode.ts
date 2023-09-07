import { AirNode } from "@thinairthings/react-nodegraph"
import { schemaFromTypeName } from "./schemaFromTypeName.js"

/** This is a test node */
export type TestNode = AirNode<{
    /** This is a name */
    name: string,
    /** This is a shape */
    shape: {[key: string]: any}
    thing: number
}, 'SomeNode'>


export const jsonStructureFromAirNode = (
    nodeName: `${Capitalize<string>}Node`
): {
    name: string,
    description: string,
    structure: Record<string, any>
} => {
    const nodeSchema = schemaFromTypeName(nodeName)
    console.log(JSON.stringify(nodeSchema, null, 4))
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
    const nodeDescription = (nodeSchema.definitions![nodeName]! as any).description
    const valueSchema = findValueNode(nodeSchema.definitions!)
    return {
        name: nodeName,
        description: nodeDescription,
        structure: valueSchema 
    }
}