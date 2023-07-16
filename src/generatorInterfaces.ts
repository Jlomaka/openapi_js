import childProcess from "child_process";
import path from "path";
import fs from "fs";

export const checkJavaInstall = async () => {
  const cmd = `java -version`;

  try {
    childProcess.execSync(cmd);
  } catch (err) {
    throw new Error("Install Java before starting");
  }
};

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

// TODO add checker on java
/**
 * https://github.com/swagger-api/swagger-codegen/tree/3.0.0#to-generate-a-sample-client-library
 */
export async function generatorInterfaces ({
  pathToGenerator = path.join(__dirname, "./openapi-generator-cli-6.1.0.jar"),
  filesToRemove = ["git_push.sh", ".openapi-generator-ignore", ".npmignore", ".gitignore", ".openapi-generator"],
  filesToModify = ["api.ts"],
  prefixInterfaces = {
    interface: "I", enum: "E", type: "T"
  },
  openapiGeneratorCLIConfiguration = {}
}: IProps) {

  if (!openapiGeneratorCLIConfiguration.output) {
    throw new Error("Add output before starting, example: path.join(__dirname, \"./\")");
  }

  await checkJavaInstall();

  console.time("generate");
  let openapiGeneratorCLIConfig: IOpenapiGeneratorCLIConfiguration = {
    "generator-name": "typescript-axios",
    "model-name-prefix": "API",
    "output": path.join(__dirname, "./"),
    ...openapiGeneratorCLIConfiguration
  };

  console.log("configuration:", openapiGeneratorCLIConfig);

  const runGenerator = () => {
    const configString = Object.entries(openapiGeneratorCLIConfig)
      .reduce((acc, [key, value]) => `${acc} --${key} ${value}`, "").trim();

    const cmd = `java -jar ${pathToGenerator} generate ${configString}`;

    console.log("command:", cmd);

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
      // Define file system path
      const filePath = path.join(openapiGeneratorCLIConfig.output || "./", file);

      // Read generated file
      let fileContent = fs.readFileSync(filePath).toString();

      // Execute replace for every export type
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
  // TODO check where is problem with generation
  removePaths(openapiGeneratorCLIConfig.output || "./", filesToRemove);

  console.timeEnd("generate");
}