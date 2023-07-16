import {generatorInterfaces} from "../src";
import {join} from "path";

const linkToSwagger = "http://rackerlabs.github.io/wadl2swagger/openstack/swagger/dbaas.json";

/**
 *
 */
(async () => {
  try {
    const openapiGeneratorCLIConfiguration = {
      "input-spec": linkToSwagger,
      "output": join(__dirname, "./"),
    };

    await generatorInterfaces({
      openapiGeneratorCLIConfiguration
    });
  } catch (err) {
    console.error(err);
  }
})();