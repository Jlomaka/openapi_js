"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorInterfaces = exports.checkFolderExistsAndIfNeededCreateNew = exports.checkJavaInstall = void 0;
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const directoryName = "./openapiInterfaces";
const checkJavaInstall = async () => {
    const cmd = `java -version`;
    try {
        child_process_1.default.execSync(cmd);
    }
    catch (err) {
        throw new Error("Install Java before starting");
    }
};
exports.checkJavaInstall = checkJavaInstall;
const checkFolderExistsAndIfNeededCreateNew = async (output = directoryName) => {
    try {
        const folderName = path_1.default.join(process.cwd(), output);
        if (!fs_1.default.existsSync(folderName)) {
            fs_1.default.mkdirSync(folderName);
        }
    }
    catch (err) {
        throw new Error("Folder value not valid, try this one 'output:\"./\"'");
    }
};
exports.checkFolderExistsAndIfNeededCreateNew = checkFolderExistsAndIfNeededCreateNew;
/**
 * https://github.com/swagger-api/swagger-codegen/tree/3.0.0#to-generate-a-sample-client-library
 */
async function generatorInterfaces({ filesToRemove = ["git_push.sh", ".openapi-generator-ignore", ".npmignore", ".gitignore", ".openapi-generator"], filesToModify = ["api.ts"], prefixInterfaces = {
    interface: "I", enum: "E", type: "T"
}, openapiGeneratorCLIConfiguration = {}, customGenerateString = "" }) {
    console.debug("Your project folder:", process.cwd());
    await (0, exports.checkJavaInstall)();
    await (0, exports.checkFolderExistsAndIfNeededCreateNew)(openapiGeneratorCLIConfiguration === null || openapiGeneratorCLIConfiguration === void 0 ? void 0 : openapiGeneratorCLIConfiguration.output);
    const openapiGeneratorCLIConfig = {
        "generator-name": "typescript-axios",
        "model-name-prefix": "API",
        ...openapiGeneratorCLIConfiguration,
        output: path_1.default.join(process.cwd(), (openapiGeneratorCLIConfiguration === null || openapiGeneratorCLIConfiguration === void 0 ? void 0 : openapiGeneratorCLIConfiguration.output) || directoryName),
    };
    console.info("configuration:", openapiGeneratorCLIConfig);
    console.time("generate");
    const runGenerator = () => {
        const configString = Object
            .entries(openapiGeneratorCLIConfig)
            .reduce((acc, [key, value]) => {
            if (key === "model-name-prefix") {
                return acc;
            }
            return `${acc} --${key} ${value}`;
        }, "").trim();
        const cmd = `openapi-generator-cli generate ${configString} ${customGenerateString}`;
        console.info("command:", cmd);
        child_process_1.default.execSync(cmd);
    };
    const removePaths = (output, files) => files.forEach((filePath) => {
        const fullPath = path_1.default.join(output, filePath);
        try {
            const res = fs_1.default.lstatSync(fullPath);
            if (res.isDirectory()) {
                fs_1.default.rmSync(fullPath, { recursive: true, force: true });
            }
            else {
                fs_1.default.unlinkSync(fullPath);
            }
        }
        catch (err) {
            throw err;
        }
    });
    const replaceExport = (source, exportType) => {
        // @ts-ignore
        const prefix = prefixInterfaces === null || prefixInterfaces === void 0 ? void 0 : prefixInterfaces[exportType];
        const matches = source.matchAll(new RegExp(`export ${exportType} (\\w+)`, "g"));
        Array.from(matches, ([, exportName]) => {
            source = source.replace(new RegExp(`${exportName}\\b`, "g"), `${prefix}${exportName}`);
        });
        return source;
    };
    const replaceReference = (source) => {
        source = source.replace(new RegExp("(\\/\\*\\*\n)((.|\\n)*?)(\\*\\/)", "g"), "");
        return source;
    };
    const replaceComments = (source) => {
        source = source.replace(new RegExp("\\/\\/ [a-zA-Z0-9 '\"@\.]+\\n", "g"), "");
        return source;
    };
    const replaceEmptyLine = (source) => {
        source = source.replace(new RegExp("[^A-Za-z0-9*/';=>{}()`,\.]+\\n[^a-zA-Z0-9]", "g"), "\n");
        return source;
    };
    const replaceSingleQuote = (source) => {
        source = source.replace(new RegExp("'", "g"), "\"");
        return source;
    };
    const updateConstName = (sources) => {
        sources = sources.replace(new RegExp("'([a-zA-Z0-9]+)'(\\??:)", "g"), "$1$2");
        return sources;
    };
    const renameExports = () => {
        filesToModify.forEach((file) => {
            const filePath = path_1.default.join((openapiGeneratorCLIConfig === null || openapiGeneratorCLIConfig === void 0 ? void 0 : openapiGeneratorCLIConfig.output) || directoryName, file);
            let fileContent = fs_1.default.readFileSync(filePath).toString();
            Object.keys(prefixInterfaces).forEach((exportTypes) => {
                fileContent = replaceExport(fileContent, exportTypes);
            });
            fileContent = replaceReference(fileContent);
            fileContent = replaceComments(fileContent);
            fileContent = replaceEmptyLine(fileContent);
            fileContent = replaceSingleQuote(fileContent);
            fileContent = updateConstName(fileContent);
            fs_1.default.writeFileSync(filePath, fileContent);
        });
    };
    runGenerator();
    // renameExports();
    // removePaths(openapiGeneratorCLIConfig?.output || directoryName, filesToRemove);
    console.timeEnd("generate");
}
exports.generatorInterfaces = generatorInterfaces;
