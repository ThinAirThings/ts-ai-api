import { AirNode, NodeValue, NodeTypeString } from '@thinairthings/react-nodegraph';
export * from '@thinairthings/react-nodegraph';

declare const jsonStructureFromFunction: (fn: Function) => Promise<{
    name: string;
    description: string;
    input: Record<string, any>;
    output: Record<string, any>;
}>;

declare enum Options {
    Option1 = "Option1",
    Option2 = "Option2",
    Option3 = "Option3"
}
/** Function Description */
declare const useVertexFilterFunctions: (params: {
    rawInput: {
        /** Param Description 1 */
        thing1: Options;
        /** Param Description 2 */
        thing2: {
            /** Data Description 1 */
            data1: string;
            /** Data Description 2 */
            data2: number;
        };
    };
}) => {
    data1: string;
    data2: number;
};
declare function fnNormalTest(params: {
    thing1: Options;
    thing2: number;
}): number;
declare const fnArrowTest: (params: {
    thing1: string;
    thing2: number;
}) => number;

/** The goal of creating a simple line chart to visualize data. */
type SimpleLineChartGoalNode = AirNode<{
    /** Reasoning as to why this goal was chosen. */
    reasoning: string;
}, 'SimpleLineChartGoalNode'>;
/** The goal of creating a pie chart to visualize data. */
type PieChartGoalNode = AirNode<{
    /** Reasoning as to why this goal was chosen. */
    reasoning: string;
    pickles: number;
}, 'PieChartGoalNode'>;
/** The set of possible goals. */
type GoalNodeIndex = {
    /** The goal of creating a simple line chart to visualize data. */
    'SimpleLineChartGoalNode': NodeValue<SimpleLineChartGoalNode>;
    /** The goal of creating a pie chart to visualize data. */
    'PieChartGoalNode': NodeValue<PieChartGoalNode>;
};
declare const jsonStructureFromNodeIndex: (indexName: `${Capitalize<string>}NodeIndex`) => {
    name: string;
    description: string;
    index: {
        [nodeKey: `${Capitalize<string>}Node`]: {
            name: NodeTypeString;
            description: string;
            structure: Record<string, any>;
        };
        [nodeKey: `${Capitalize<string>}${Capitalize<string>}Node`]: {
            name: NodeTypeString;
            description: string;
            structure: Record<string, any>;
        };
        [nodeKey: `${Capitalize<string>}${Capitalize<string>}${Capitalize<string>}Node`]: {
            name: NodeTypeString;
            description: string;
            structure: Record<string, any>;
        };
        [nodeKey: `${Capitalize<string>}${Capitalize<string>}${Capitalize<string>}${Capitalize<string>}Node`]: {
            name: NodeTypeString;
            description: string;
            structure: Record<string, any>;
        };
        [nodeKey: `${Capitalize<string>}${Capitalize<string>}${Capitalize<string>}${Capitalize<string>}${Capitalize<string>}Node`]: {
            name: NodeTypeString;
            description: string;
            structure: Record<string, any>;
        };
        [nodeKey: `${Capitalize<string>}${Capitalize<string>}${Capitalize<string>}${Capitalize<string>}${Capitalize<string>}${Capitalize<string>}Node`]: {
            name: NodeTypeString;
            description: string;
            structure: Record<string, any>;
        };
    };
};

/** The input to the system which will take an array of goals and begin trying to achieve them. */
type ResolutionOutputNode = AirNode<{
    /** An array of goals */
    goals: Array<{
        /** The name of the goal. */
        goal: keyof GoalNodeIndex;
        /** The reasoning behind choosing this goal. */
        reasoning: string;
    }>;
}, 'ResolutionOutputNode'>;
declare const jsonStructureFromAirNode: (nodeName: `${Capitalize<string>}Node`) => {
    name: string;
    description: string;
    structure: Record<string, any>;
};

export { GoalNodeIndex, PieChartGoalNode, ResolutionOutputNode, SimpleLineChartGoalNode, fnArrowTest, fnNormalTest, jsonStructureFromAirNode, jsonStructureFromFunction, jsonStructureFromNodeIndex, useVertexFilterFunctions };
