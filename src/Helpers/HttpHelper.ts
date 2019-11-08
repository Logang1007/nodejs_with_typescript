import express, { Request, Response } from 'express';

export default class HttpHelper {



    private isObject(obj: any) {
        return obj != null && obj.constructor.name === "Object"
    }

    parsePostBodyData = async (request: Request, response: Response,returnBodyAsJsonObject:boolean) => {
        return new Promise((resolve) => {
            let postData: any = [];
            request.on('data', chunk => {
                postData.push(chunk)
            });
            request.on('end', () => {
                postData = Buffer.concat(postData).toString();
                var datObj = "";
                if (!returnBodyAsJsonObject) {
                    datObj = postData;
                } else {
                    datObj = JSON.stringify(postData);
                    if (!this.isObject(postData)) {
                        datObj = JSON.parse(postData);
                    }
                }
                
                Promise.resolve().then((result) => {
                    resolve(datObj);
                });

            })
        });

    }

    getJson = async (app: express.Application, url: string,onSuccess:Function) => {
        app.get(url, (req, res) => {

            Promise.resolve(onSuccess(req, res)).then((result) => {
                res.statusCode = 200;
              
            }).catch((reason) => {
                res.statusCode = 500;
                res.send(reason)
            });

        });


    }

    postJson = async (app: express.Application, url: string, returnBodyAsJsonObject: boolean, onSuccess: Function) => {
        app.post(url, async (req, res) => {
            let bodyData = await this.parsePostBodyData(req, res, returnBodyAsJsonObject);
            Promise.resolve(onSuccess(req, res, bodyData)).then((result) => {
                res.statusCode = 200;

            }).catch((reason) => {
                res.statusCode = 500;
                res.send(reason)
            });

        });

    }

}

