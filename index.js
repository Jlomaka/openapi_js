import childProcess from "child_process";
import path, {dirname} from "path";
import fs from "fs";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
}) {

  if (!openapiGeneratorCLIConfiguration.output) {
    throw new Error("Add output before starting, example: path.join(__dirname, \"./\")");
  }

  console.time("generate");
  let openapiGeneratorCLIConfig = {
    "generator-name": "typescript-axios",
    "model-name-prefix": "API",
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

  // TODO update to Promise.all
  const removePaths = (output, files) => files.forEach((filePath) => {
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

  const replaceExport = (source, exportType) => {
    const prefix = prefixInterfaces[exportType];
    const matches = source.matchAll(new RegExp(`export ${exportType} (\\w+)`, "g"));

    Array.from(matches, ([, exportName]) => {
      source = source.replace(new RegExp(`${exportName}\\b`, "g"), `${prefix}${exportName}`);
    });

    return source;
  };

  // TODO replace comments like //
  const replaceComments = (source) => {
    source = source.replace(new RegExp("(\\/\\*\\*\n)((.|\\n)*?)(\\*\\/)", "g"), "");
    return source;
  };

  // TODO replace all empty string

  const updateConstName = (sources) => {
    sources = sources.replace(new RegExp("'([a-zA-Z0-9]+)'(\\??:)", "g"), "$1$2");
    return sources;
  };

  const renameExports = () => {
    filesToModify.forEach((file) => {
      // Define file system path
      const filePath = path.join(openapiGeneratorCLIConfig.output, file);

      // Read generated file
      let fileContent = fs.readFileSync(filePath).toString();

      // Execute replace for every export type
      Object.keys(prefixInterfaces).forEach((exportTypes) => {
        fileContent = replaceExport(fileContent, exportTypes);
      });

      fileContent = replaceComments(fileContent);
      fileContent = updateConstName(fileContent);

      fs.writeFileSync(filePath, fileContent);
    });
  };

  runGenerator();
  renameExports();
  // TODO check where is problem with generation
  removePaths(openapiGeneratorCLIConfig.output, filesToRemove);

  console.timeEnd("generate");
}
