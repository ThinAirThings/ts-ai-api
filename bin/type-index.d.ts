declare const getFunctionParameters: (fn: Function) => Promise<{
    name: string;
    description: string;
    parameters: Record<string, any>;
}>;

declare enum Options {
    Option1 = "Option1",
    Option2 = "Option2",
    Option3 = "Option3"
}
/** Function Description */
declare const useVertexFilterFunctions: (params: {
    rawInput: {
        /**This is also a param description */
        thing1: Options;
        thing2: number;
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

export { fnArrowTest, fnNormalTest, getFunctionParameters, useVertexFilterFunctions };
