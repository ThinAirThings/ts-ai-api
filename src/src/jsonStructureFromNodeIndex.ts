import { AirNode, NodeIndex, NodeTypeString, NodeValue } from "@thinairthings/react-nodegraph"
import path from "path"
import { createGenerator } from "ts-json-schema-generator"
import { schemaFromTypeName } from "./schemaFromTypeName.js"

/** The goal of creating a simple line chart to visualize data. */
export type SimpleLineChartGoalNode = AirNode<{
    /** Reasoning as to why this goal was chosen. */
    reasoning: string
}, 'SimpleLineChartGoalNode'>

/** The goal of creating a pie chart to visualize data. */
export type PieChartGoalNode = AirNode<{
    /** Reasoning as to why this goal was chosen. */
    reasoning: string
    pickles: number
}, 'PieChartGoalNode'>

// /** The set of possible goals. */
// export type GoalNodeIndex = NodeIndex<
//     | SimpleLineChartGoalNode
//     | PieChartGoalNode
// >

/** The set of possible goals. */
export type GoalNodeIndex = {
    /** The goal of creating a simple line chart to visualize data. */
    'SimpleLineChartGoalNode': NodeValue<SimpleLineChartGoalNode>
    /** The goal of creating a pie chart to visualize data. */
    'PieChartGoalNode': NodeValue<PieChartGoalNode>
}

export const jsonStructureFromNodeIndex = (
    indexName: `${Capitalize<string>}NodeIndex`
): {
    name: string
    description: string
    index: {
        [nodeKey: NodeTypeString]: {
            name: NodeTypeString
            description: string
            structure: Record<string, any>
        }
    }
} => {
    const indexSchema = schemaFromTypeName(indexName)
    // console.log(JSON.stringify(indexSchema, null, 4))
    const definitions = indexSchema.definitions as {
        [indexKey: typeof indexName]: {
            description: string
            properties: {
                [nodeName: NodeTypeString]: {
                    description: string
                }
            }
        },
        [nodeKey: `NodeValue<${NodeTypeString}>`]: {
            properties: Record<string, any>
        }
    }
    const index = Object.fromEntries(Object.entries(definitions)
        .filter(([key]) => {
            const match = key.match(/<([^>]+)>/)
            return (match && match.length > 0) ? true : false
        })
        .map(([key, value]) => {
            const match = key.match(/<([^>]+)>/)![1]
            return [
                key.match(/<([^>]+)>/)![1] as NodeTypeString,
                {
                    name: match as NodeTypeString,
                    description: definitions[indexName].properties[match as any]?.description??'',
                    structure: value.properties
                }
            ]
        })
    )

    return {
        name: indexName,
        description: definitions[indexName].description,
        index: index
    }
}