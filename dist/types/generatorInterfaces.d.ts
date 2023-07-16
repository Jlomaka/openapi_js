export declare const checkJavaInstall: () => Promise<void>;
interface IPrefixInterfaces {
    interface?: string;
    enum?: string;
    type?: string;
}
interface IOpenapiGeneratorCLIConfiguration {
    readonly ["generator-name"]?: string;
    ["model-name-prefix"]?: string;
    output?: string;
}
interface IProps {
    pathToGenerator?: string;
    filesToRemove?: string[];
    filesToModify?: string[];
    prefixInterfaces?: IPrefixInterfaces;
    openapiGeneratorCLIConfiguration?: IOpenapiGeneratorCLIConfiguration;
}
/**
 * https://github.com/swagger-api/swagger-codegen/tree/3.0.0#to-generate-a-sample-client-library
 */
export declare function generatorInterfaces({ pathToGenerator, filesToRemove, filesToModify, prefixInterfaces, openapiGeneratorCLIConfiguration }: IProps): Promise<void>;
export {};
