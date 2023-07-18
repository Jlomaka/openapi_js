import {generatorInterfaces, IOpenapiGeneratorCLIConfiguration} from "../src";

const linkToSwagger = "http://rackerlabs.github.io/wadl2swagger/openstack/swagger/dbaas.json";

(async () => {
  try {
    const openapiGeneratorCLIConfiguration: IOpenapiGeneratorCLIConfiguration = {
      "input-spec": linkToSwagger,
      "output": "./interfaces",
    };

    await generatorInterfaces({
      openapiGeneratorCLIConfiguration
    });
  } catch (err) {
    console.error(err);
  }
})();