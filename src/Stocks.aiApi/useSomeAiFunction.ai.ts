
// enum Api {
//     stocks = 'stocks',
//     charts = 'charts',
//     weather = 'weather'
// }
// export type EnumTest = {
//     /**
//      * This is a description.
//      * @type {Array<{ apiName: Api, apiReasoning: string }>}
//      */
//     composition: Array<{
//         /**
//          * This is a description2 for the API name.
//          * @type {Api}
//          */
//         apiName: Api,
//         /**
//          * Describes the reasoning behind using the specified API.
//          * @type {string}
//          */
//         apiReasoning: string
//     }>
// }

// type AiFn<in T> = (t1: T) => any

enum Api {
    stocks = 'stocks',
    charts = 'charts',
    weather = 'weather'
}

export const useSomeAiFunction = (
/** This is a description for All Params.*/ {
    val1, val2
}: {
    /** This is a description for Val1.*/
    val1: {
        /** This is the set of options for the object. */
        obj1: Api,
        obj2: number
    },
    val2: number
}) => {
    console.log(val1, val2)
}

