export declare const checkJavaInstall: () => Promise<void>;
export declare const checkFolderExistsAndIfNeededCreateNew: (output?: string) => Promise<void>;
interface IPrefixInterfaces {
    interface?: string;
    enum?: string;
    type?: string;
}
export interface IOpenapiGeneratorCLIConfiguration {
    /**
     * https://example.com/swagger.json
     */
    readonly ["generator-name"]?: string;
    /**
     * API
     */
    ["model-name-prefix"]?: string;
    /**
     * https://example.com/swagger.json
     */
    ["input-spec"]?: string;
    /**
     * @example "Authorization:Token ${token}"
     */
    auth?: string;
    /**
     * @example "./interfaces"
     */
    output?: string;
}
interface IProps {
    filesToRemove?: string[];
    filesToModify?: string[];
    prefixInterfaces?: IPrefixInterfaces;
    openapiGeneratorCLIConfiguration?: IOpenapiGeneratorCLIConfiguration;
    customGenerateString?: string;
}
/**
 * https://github.com/swagger-api/swagger-codegen/tree/3.0.0#to-generate-a-sample-client-library
 */
export declare function generatorInterfaces({ filesToRemove, filesToModify, prefixInterfaces, openapiGeneratorCLIConfiguration, customGenerateString }: IProps): Promise<void>;
export {};
