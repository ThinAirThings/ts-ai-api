import { AirNode } from '@thinairthings/react-nodegraph';

declare const jsonStructureFromFunction: (fn: Function) => Promise<{
    name: string;
    description: string;
    input: Record<string, any>;
    output: Record<string, any>;
}>;

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
declare const jsonStructureFromAirNode: (nodeName: string) => {
    name: string;
    description: string;
    structure: Record<string, any>;
};

export { TestNode, jsonStructureFromAirNode, jsonStructureFromFunction };
