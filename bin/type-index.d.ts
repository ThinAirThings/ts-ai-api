import { AirNode, NodeValue } from '@thinairthings/react-nodegraph';
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
}, 'someNode'>;
declare const testFn2: ({ input }: {
    input: NodeValue<TestNode>;
}) => void;
declare const jsonStructureFromAirNode: (nodeName: string) => Promise<{
    name: string;
    description: any;
    structure: any;
}>;

export { TestNode, fnArrowTest, fnNormalTest, jsonStructureFromAirNode, jsonStructureFromFunction, testFn2, useVertexFilterFunctions };
