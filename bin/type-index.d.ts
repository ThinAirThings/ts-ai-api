declare const jsonInputStructureFromFunction: (fn: Function) => Promise<{
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

export { fnArrowTest, fnNormalTest, jsonInputStructureFromFunction, useVertexFilterFunctions };

export type useVertexFilterFunctions_Input = { /** */
    /**
     * Param Description 1
     */
    /** */
    /**
     * Data Description 1
     */
    /** */
    /**
     * Data Description 2
     */
    rawInput: { /** */
        /**
         * Param Description 1
         */
        thing1: Options; /** */
        /**
         * Data Description 1
         */
        /** */
        /**
         * Data Description 2
         */
        thing2: { /** */
            /**
             * Data Description 1
             */
            data1: string; /** */
            /**
             * Data Description 2
             */
            data2: number; }; }; };
export type useVertexFilterFunctions_Output = { /** */
    /**
     * Data Description 1
     */
    data1: string; /** */
    /**
     * Data Description 2
     */
    data2: number; };
