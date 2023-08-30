declare enum Api {
    stocks = "stocks",
    charts = "charts",
    weather = "weather"
}
export declare const useSomeAiFunction: ({ val1, val2 }: {
    /** This is a description for Val1.*/
    val1: {
        /** This is the set of options for the object. */
        obj1: Api;
        obj2: number;
    };
    val2: number;
}) => void;
export {};
