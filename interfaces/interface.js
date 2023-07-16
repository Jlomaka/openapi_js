import {generatorInterfaces} from "../index.js"
import path, {dirname} from "path";
import {fileURLToPath} from "url";

const linkToSwagger = "http://rackerlabs.github.io/wadl2swagger/openstack/swagger/dbaas.json";

(async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const openapiGeneratorCLIConfiguration = {
      "input-spec": linkToSwagger,
      "output": path.join(__dirname, "./"),
    };

    await generatorInterfaces({
      openapiGeneratorCLIConfiguration
    });
  } catch (err) {
    console.error(err);
  }
})();