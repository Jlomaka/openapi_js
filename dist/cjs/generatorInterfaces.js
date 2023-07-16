"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorInterfaces = exports.checkJavaInstall = void 0;
var child_process_1 = __importDefault(require("child_process"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var checkJavaInstall = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cmd;
    return __generator(this, function (_a) {
        cmd = "java -version";
        try {
            child_process_1.default.execSync(cmd);
        }
        catch (err) {
            throw new Error("Install Java before starting");
        }
        return [2 /*return*/];
    });
}); };
exports.checkJavaInstall = checkJavaInstall;
// TODO add checker on java
/**
 * https://github.com/swagger-api/swagger-codegen/tree/3.0.0#to-generate-a-sample-client-library
 */
function generatorInterfaces(_a) {
    var _b = _a.pathToGenerator, pathToGenerator = _b === void 0 ? path_1.default.join(__dirname, "./openapi-generator-cli-6.1.0.jar") : _b, _c = _a.filesToRemove, filesToRemove = _c === void 0 ? ["git_push.sh", ".openapi-generator-ignore", ".npmignore", ".gitignore", ".openapi-generator"] : _c, _d = _a.filesToModify, filesToModify = _d === void 0 ? ["api.ts"] : _d, _e = _a.prefixInterfaces, prefixInterfaces = _e === void 0 ? {
        interface: "I", enum: "E", type: "T"
    } : _e, _f = _a.openapiGeneratorCLIConfiguration, openapiGeneratorCLIConfiguration = _f === void 0 ? {} : _f;
    return __awaiter(this, void 0, void 0, function () {
        var openapiGeneratorCLIConfig, runGenerator, removePaths, replaceExport, replaceReference, replaceComments, replaceEmptyLine, replaceSingleQuote, updateConstName, renameExports;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!openapiGeneratorCLIConfiguration.output) {
                        throw new Error("Add output before starting, example: path.join(__dirname, \"./\")");
                    }
                    return [4 /*yield*/, (0, exports.checkJavaInstall)()];
                case 1:
                    _g.sent();
                    console.time("generate");
                    openapiGeneratorCLIConfig = __assign({ "generator-name": "typescript-axios", "model-name-prefix": "API", "output": path_1.default.join(__dirname, "./") }, openapiGeneratorCLIConfiguration);
                    console.log("configuration:", openapiGeneratorCLIConfig);
                    runGenerator = function () {
                        var configString = Object.entries(openapiGeneratorCLIConfig)
                            .reduce(function (acc, _a) {
                            var key = _a[0], value = _a[1];
                            return "".concat(acc, " --").concat(key, " ").concat(value);
                        }, "").trim();
                        var cmd = "java -jar ".concat(pathToGenerator, " generate ").concat(configString);
                        console.log("command:", cmd);
                        child_process_1.default.execSync(cmd);
                    };
                    removePaths = function (output, files) { return files.forEach(function (filePath) {
                        var fullPath = path_1.default.join(output, filePath);
                        try {
                            var res = fs_1.default.lstatSync(fullPath);
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
                    }); };
                    replaceExport = function (source, exportType) {
                        var _a;
                        var prefix = ((_a = [prefixInterfaces]) === null || _a === void 0 ? void 0 : _a[exportType]) || "";
                        var matches = source.matchAll(new RegExp("export ".concat(exportType, " (\\w+)"), "g"));
                        Array.from(matches, function (_a) {
                            var exportName = _a[1];
                            source = source.replace(new RegExp("".concat(exportName, "\\b"), "g"), "".concat(prefix).concat(exportName));
                        });
                        return source;
                    };
                    replaceReference = function (source) {
                        source = source.replace(new RegExp("(\\/\\*\\*\n)((.|\\n)*?)(\\*\\/)", "g"), "");
                        return source;
                    };
                    replaceComments = function (source) {
                        source = source.replace(new RegExp("\\/\\/ [a-zA-Z0-9 '\"@\.]+\\n", "g"), "");
                        return source;
                    };
                    replaceEmptyLine = function (source) {
                        source = source.replace(new RegExp("[^A-Za-z0-9*/';=>{}()`,\.]+\\n[^a-zA-Z0-9]", "g"), "\n");
                        return source;
                    };
                    replaceSingleQuote = function (source) {
                        source = source.replace(new RegExp("'", "g"), "\"");
                        return source;
                    };
                    updateConstName = function (sources) {
                        sources = sources.replace(new RegExp("'([a-zA-Z0-9]+)'(\\??:)", "g"), "$1$2");
                        return sources;
                    };
                    renameExports = function () {
                        filesToModify.forEach(function (file) {
                            // Define file system path
                            var filePath = path_1.default.join(openapiGeneratorCLIConfig.output || "./", file);
                            // Read generated file
                            var fileContent = fs_1.default.readFileSync(filePath).toString();
                            // Execute replace for every export type
                            Object.keys(prefixInterfaces).forEach(function (exportTypes) {
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
                    renameExports();
                    // TODO check where is problem with generation
                    removePaths(openapiGeneratorCLIConfig.output || "./", filesToRemove);
                    console.timeEnd("generate");
                    return [2 /*return*/];
            }
        });
    });
}
exports.generatorInterfaces = generatorInterfaces;
