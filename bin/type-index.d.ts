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

/** This is a test node */
type TestNode = AirNode<{
    /** This is a name */
    name: string;
    /** This is a shape */
    shape: {
        [key: string]: any;
    };
    thing: number;
}, 'SomeNode'>;
declare const jsonStructureFromAirNode: (nodeName: `${Capitalize<string>}Node`) => {
    name: string;
    description: string;
    structure: Record<string, any>;
};

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

export { GoalNodeIndex, PieChartGoalNode, SimpleLineChartGoalNode, TestNode, fnArrowTest, fnNormalTest, jsonStructureFromAirNode, jsonStructureFromFunction, jsonStructureFromNodeIndex, useVertexFilterFunctions };
