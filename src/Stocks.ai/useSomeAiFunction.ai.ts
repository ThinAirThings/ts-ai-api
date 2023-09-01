import {Edge, Vertex, useVertex} from "@thinairthings/react-nodegraph"


export type _Input = 
/** This is the function description */
{
    /** This is the raw Input Descriptiuon */
    rawInput: string
}
/**This is ALSO description */
export const useVertexFilterFunctions = (
/**This is a description */
inputEdge: Edge<{ 
    rawInput: string
}>) => {
    const [filteredFunctionsEdge] = useVertex(async ([{rawInput}]) => {
        return {
            filteredFunctions: 5
        }
    }, [inputEdge])
    return filteredFunctionsEdge
}

export type _Output = {
    filteredFunctions: number
}


const fn = (params: {
    thing1: string
    thing2: number
}): number => {
    return 5
}

const someTSCWrapperFunction = (fn: Function) => {
    return {
        params: {
            thing1: 'string',
            thing2: 'number'
        }
    }
}

const targetOutput = someTSCWrapperFunction(fn)
