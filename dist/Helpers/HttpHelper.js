"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class HttpHelper {
    constructor() {
        this.parsePostBodyData = (request, response, returnBodyAsJsonObject) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                let postData = [];
                request.on('data', chunk => {
                    postData.push(chunk);
                });
                request.on('end', () => {
                    postData = Buffer.concat(postData).toString();
                    var datObj = "";
                    if (!returnBodyAsJsonObject) {
                        datObj = postData;
                    }
                    else {
                        datObj = JSON.stringify(postData);
                        if (!this.isObject(postData)) {
                            datObj = JSON.parse(postData);
                        }
                    }
                    Promise.resolve().then((result) => {
                        resolve(datObj);
                    });
                });
            });
        });
        this.getJson = (app, url, onSuccess) => __awaiter(this, void 0, void 0, function* () {
            app.get(url, (req, res) => {
                Promise.resolve(onSuccess(req, res)).then((result) => {
                    res.statusCode = 200;
                }).catch((reason) => {
                    res.statusCode = 500;
                    res.send(reason);
                });
            });
        });
        this.postJson = (app, url, returnBodyAsJsonObject, onSuccess) => __awaiter(this, void 0, void 0, function* () {
            app.post(url, (req, res) => __awaiter(this, void 0, void 0, function* () {
                let bodyData = yield this.parsePostBodyData(req, res, returnBodyAsJsonObject);
                Promise.resolve(onSuccess(req, res, bodyData)).then((result) => {
                    res.statusCode = 200;
                }).catch((reason) => {
                    res.statusCode = 500;
                    res.send(reason);
                });
            }));
        });
    }
    isObject(obj) {
        return obj != null && obj.constructor.name === "Object";
    }
}
exports.default = HttpHelper;
//# sourceMappingURL=HttpHelper.js.map