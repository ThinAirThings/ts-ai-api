import { Edge, useVertex } from "@thinairthings/react-nodegraph"

enum Options {
    Option1 = 'Option1',
    Option2 = 'Option2',
    Option3 = 'Option3'
}

/** Function Description */
export const useVertexFilterFunctions = (params: { 
    rawInput: {
        /**This is also a param description */
        thing1: Options
        thing2: number
    }
}): {
    data1: string
    data2: number
} => {
    const [filteredFunctionsEdge] = useVertex(async ([]) => {
        return {
            filteredFunctions: 5
        }
    }, [])
    return {
        data1: 'fdsfas',
        data2: 5
    }
}
// export const useVertexFilterFunctionsPath = __dirname

export function fnNormalTest (params: {
    thing1: Options
    thing2: number
}): number {
    return 5
}
export const fnArrowTest = (params: {
    thing1: string
    thing2: number
}): number => {
    return 5
}