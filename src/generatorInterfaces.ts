import childProcess from "child_process";
import path from "path";
import fs from "fs";

const directoryName = "./openapiInterfaces";

export const checkJavaInstall = async () => {
  const cmd = `java -version`;

  try {
    childProcess.execSync(cmd);
  } catch (err) {
    throw new Error("Install Java before starting");
  }
};

export const checkFolderExistsAndIfNeededCreateNew = async (output = directoryName) => {
  try {
    const folderName = path.join(process.cwd(), output);

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    throw new Error("Folder value not valid, try this one 'output:\"./\"'");
  }
};

interface IPrefixInterfaces {
  interface?: string;
  enum?: string;
  type?: string;
}

export interface IOpenapiGeneratorCLIConfiguration {
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
  pathToGenerator?: string;
  filesToRemove?: string[];
  filesToModify?: string[];
  prefixInterfaces?: IPrefixInterfaces;
  openapiGeneratorCLIConfiguration?: IOpenapiGeneratorCLIConfiguration;
}

/**
 * https://github.com/swagger-api/swagger-codegen/tree/3.0.0#to-generate-a-sample-client-library
 */
export async function generatorInterfaces ({
  pathToGenerator = path.join(__dirname, "../../files/openapi-generator-cli-6.1.0.jar"),
  filesToRemove = ["git_push.sh", ".openapi-generator-ignore", ".npmignore", ".gitignore", ".openapi-generator"],
  filesToModify = ["api.ts"],
  prefixInterfaces = {
    interface: "I", enum: "E", type: "T"
  },
  openapiGeneratorCLIConfiguration = {}
}: IProps) {
  console.debug("Your project folder:", process.cwd());

  await checkJavaInstall();

  await checkFolderExistsAndIfNeededCreateNew(openapiGeneratorCLIConfiguration?.output);

  const openapiGeneratorCLIConfig: IOpenapiGeneratorCLIConfiguration = {
    "generator-name": "typescript-axios",
    "model-name-prefix": "API",
    ...openapiGeneratorCLIConfiguration,
    output: path.join(process.cwd(), openapiGeneratorCLIConfiguration?.output || directoryName),
  };

  console.info("configuration:", openapiGeneratorCLIConfig);

  console.time("generate");

  const runGenerator = () => {
    const configString = Object.entries(openapiGeneratorCLIConfig)
      .reduce((acc, [key, value]) => `${acc} --${key} ${value}`, "").trim();

    const cmd = `java -jar ${pathToGenerator} generate ${configString}`;

    console.info("command:", cmd);

    childProcess.execSync(cmd);
  };

  const removePaths = (output: string, files: string[]) => files.forEach((filePath) => {
    const fullPath = path.join(output, filePath);

    try {
      const res = fs.lstatSync(fullPath);

      if (res.isDirectory()) {
        fs.rmSync(fullPath, {recursive: true, force: true});
      } else {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      throw err;
    }
  });

  const replaceExport = (source: string, exportType: any) => {
    const prefix = [prefixInterfaces as IPrefixInterfaces]?.[exportType] || "";
    const matches = source.matchAll(new RegExp(`export ${exportType} (\\w+)`, "g"));

    Array.from(matches, ([, exportName]) => {
      source = source.replace(new RegExp(`${exportName}\\b`, "g"), `${prefix}${exportName}`);
    });

    return source;
  };

  const replaceReference = (source: string) => {
    source = source.replace(new RegExp("(\\/\\*\\*\n)((.|\\n)*?)(\\*\\/)", "g"), "");
    return source;
  };

  const replaceComments = (source: string) => {
    source = source.replace(new RegExp("\\/\\/ [a-zA-Z0-9 '\"@\.]+\\n", "g"), "");
    return source;
  };

  const replaceEmptyLine = (source: string) => {
    source = source.replace(new RegExp("[^A-Za-z0-9*/';=>{}()`,\.]+\\n[^a-zA-Z0-9]", "g"), "\n");
    return source;
  };

  const replaceSingleQuote = (source: string) => {
    source = source.replace(new RegExp("'", "g"), "\"");
    return source;
  };

  const updateConstName = (sources: string) => {
    sources = sources.replace(new RegExp("'([a-zA-Z0-9]+)'(\\??:)", "g"), "$1$2");
    return sources;
  };

  const renameExports = () => {
    filesToModify.forEach((file) => {
      const filePath = path.join(openapiGeneratorCLIConfig.output || directoryName, file);

      let fileContent = fs.readFileSync(filePath).toString();

      Object.keys(prefixInterfaces).forEach((exportTypes) => {
        fileContent = replaceExport(fileContent, exportTypes);
      });

      fileContent = replaceReference(fileContent);
      fileContent = replaceComments(fileContent);
      fileContent = replaceEmptyLine(fileContent);
      fileContent = replaceSingleQuote(fileContent);
      fileContent = updateConstName(fileContent);

      fs.writeFileSync(filePath, fileContent);
    });
  };

  runGenerator();
  renameExports();
  removePaths(openapiGeneratorCLIConfig.output || directoryName, filesToRemove);

  console.timeEnd("generate");
}