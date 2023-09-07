import { AirNode } from "@thinairthings/react-nodegraph"
import { schemaFromTypeName } from "./schemaFromTypeName.js"
import { GoalNodeIndex } from "./jsonStructureFromNodeIndex.js"

/** The input to the system which will take an array of goals and begin trying to achieve them. */
export type ResolutionOutputNode = AirNode<{
    /** An array of goals */
    goals: Array<{
        /** The name of the goal. */
        goal: keyof GoalNodeIndex,
        /** The reasoning behind choosing this goal. */
        reasoning: string
    }>
}, 'ResolutionOutputNode'>


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