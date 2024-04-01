# HOW IT WORK

under the hood it used @openapitools/openapi-generator-cli just with extra functions like prefix to interfaces, types, enums clear no needed information.

# Installation and usage

```npm install openapi_js```

In my case, I created the `interfaces` folder in the root of the project and added a file with `interface.js` there with one of the options below.

## Without Auth
```js
const {generatorInterfaces} = require("openapi_js");

/**
 * @example https://petstore.swagger.io/v2/swagger.json
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
const axios = require("axios");
const {generatorInterfaces} = require("openapi_js");

/**
 * @example {https://{{SITE_NAME}}/swagger.json}
 */
const linkToSwagger = "{{LINK_TO_YOUR_SWAGGER}}";
let token;

const getAuthToken = async () => {
  try {
    const res = await axios({
      baseURL: "https://example.com",
      url: "/login",
      method: "POST",
      data: JSON.stringify({
        email: "test@example.com", password: "example"
      }),
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      }
    });

    token = res.data.key;
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

## Troubleshot

# Type error

if you are using the front of the application without a back, at the time of the script execution you will need to add the following line to your `package.json` file

```json
{
  "type": "module"
}
```