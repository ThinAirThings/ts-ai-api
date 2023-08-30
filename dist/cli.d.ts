export type AiApiJSON = {
    apiName: string;
    description: string;
    functions: Record<string, {
        name: string;
        description: string;
        parameters: Record<string, any>;
    }>;
};
