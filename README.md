# HOW IT WORK

under the hood it used https://openapi-generator.tech/ without previous installation.

# Installation and usage

```npm install openapi_js```

In my case, I created the `interfaces` folder in the root of the project and added a file with `interface.js` there with one of the options below.

## Without Auth
```js
const {generatorInterfaces} = require("openapi_js");

/**
 * @example {https://{{SITE_NAME}}/swagger.json}
 */
const linkToSwagger = "{{LINK_TO_YOUR_SWAGGER}}";

(async () => {
  try {

    const openapiGeneratorCLIConfiguration = {
      "input-spec": linkToSwagger,
      // folder for files to be created
      "output": "./interfaces",
    };

    await generatorInterfaces({
      openapiGeneratorCLIConfiguration
    });
  } catch (err) {
    console.log(err);
  }
})();
```

## With Auth
```js
const fetch = require("node-fetch");
const {generatorInterfaces} = require("openapi_js");
const path = require("path");

/**
 * @example {https://{{SITE_NAME}}/swagger.json}
 */
const linkToSwagger = "{{LINK_TO_YOUR_SWAGGER}}";
let token;

const getAuthToken = async () => {
  try {
    /**
     * @example {https://{{SITE_NAME}}/api/login}
     */
    let res = await fetch("{{LINK_TO_YOUR_API_AUTH_GET_TOKEN_METHODS}}", {
      method: "POST", headers: {
        "Content-Type": "application/json;charset=utf-8"
      }, body: JSON.stringify({
        email: "test@test.test", password: "12345678"
      })
    });
    res = await res.json();

    token = res.token;
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  try {
    await getAuthToken();

    const openapiGeneratorCLIConfiguration = {
      "input-spec": linkToSwagger,
      "auth": `"Authorization:Token ${token}"`,
      // folder for files to be created
      "output": "./interfaces",
    };

    await generatorInterfaces({
      openapiGeneratorCLIConfiguration
    });
  } catch (err) {
    console.log(err);
  }
})();
```

# Options

## Props

- `filesToRemove` - default: ```["git_push.sh", ".openapi-generator-ignore", ".npmignore", ".gitignore", ".openapi-generator"]```
- `prefixInterfaces` - default: ```{
  interface: "I", enum: "E", type: "T"
}```

# package.json

Just add this script to your package.json
```json
{
  "scripts": {
    "generate:interfaces": "node interfaces/interface.js"
  }
}
```
