import { Edge } from "@thinairthings/react-nodegraph";
export type _Input = 
/** This is the function description */
{
    /** This is the raw Input Descriptiuon */
    rawInput: string;
};
/**This is ALSO description */
export declare const useVertexFilterFunctions: (inputEdge: Edge<{
    rawInput: string;
}>) => Edge<{
    filteredFunctions: number;
}>;
export type _Output = {
    filteredFunctions: number;
};
