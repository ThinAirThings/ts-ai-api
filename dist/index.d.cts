declare const jsonInputStructureFromFunction: (fn: Function) => Promise<{
    name: string;
    description: string;
    parameters: Record<string, any>;
}>;

export { jsonInputStructureFromFunction };
