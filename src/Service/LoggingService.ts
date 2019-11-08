import express, { Request, Response } from 'express';
import DatabaseDTO from '../Models/DatabaseDTO';
import { LogDataDTO } from '../Models/LogDataDTO';
import MSSQLDBHelper, { InsertRecord, DbSqlType } from '../Helpers/MSSQLDBHelper';
import HttpHelper from '../Helpers/HttpHelper';



export default class LoggingService {
    public apiRoute: string = "";
    public app: express.Application
    public databaseDTO: DatabaseDTO;
    private mssqlDBHelper: MSSQLDBHelper;
    private httpHelper: HttpHelper;
    

    constructor() {
       
        this.mssqlDBHelper = new MSSQLDBHelper();
        this.httpHelper = new HttpHelper();
        
    }


    getLogData = async () => {
        var self = this;
        this.httpHelper.getJson(this.app,
            this.apiRoute + '/GetLogData/:appId', async function (req: Request, res:Response) {
                var appId = req.params.appId;
                let result = await self.getLogDataFromDB(appId);
                res.statusCode=200;
                res.send(result);
            }
        )        
    }





    addLog = async () => {
        var self = this;

        this.httpHelper.postJson(this.app,
            this.apiRoute + '/AddLog',true, async function (req: Request, res: Response,bodyJsonData:any) {
                try {
                    var datObj = bodyJsonData as LogDataDTO;
                    let result = await self.addLogData(datObj);
                    res.statusCode = 200;
                    res.send(result);
                   
                } catch (ex) {
                    res.statusCode = 500;
                    res.send(ex)
                }
                
            }
        )   


    }

    private getLogDataFromDB = async (appId: number) => {
        var returnValue: Array<LogDataDTO>;
        var colums: Array<InsertRecord> = [];
        colums.push({
            columName: "LogApplicationId",
            columValue: appId,
            colType: DbSqlType.Number,
        });

       
        returnValue = await this.mssqlDBHelper.executeStoredProcedureWithType<Array<LogDataDTO>>(this.databaseDTO, "[dbo].[GetLogDataByApplicationId]", colums);

        //returnValue = result as Array<LogDataDTO>;

        return returnValue;

    }

    private addLogData = async (logDataDTO: LogDataDTO) => {
        var colums: Array<InsertRecord> = [];
        colums.push({
            columName: "LogSeverityId",
            columValue: logDataDTO.LogSeverityId,
            colType: DbSqlType.Number,
        });
        colums.push({
            columName: "LogTypeId",
            columValue: logDataDTO.LogTypeId,
            colType: DbSqlType.Number,
        });
        colums.push({
            columName: "Code",
            columValue: logDataDTO.Code,
            colType: DbSqlType.String,
        });
        colums.push({
            columName: "ModuleName",
            columValue: logDataDTO.ModuleName,
            colType: DbSqlType.String,
        });
        colums.push({
            columName: "Request",
            columValue: logDataDTO.Request,
            colType: DbSqlType.String,
        });
        colums.push({
            columName: "Response",
            columValue: logDataDTO.Response,
            colType: DbSqlType.String,
        });
        colums.push({
            columName: "Data",
            columValue: logDataDTO.Data,
            colType: DbSqlType.String,
        });
        colums.push({
            columName: "DateAdded",
            columValue: new Date(),
            colType: DbSqlType.Date,
        });


        colums.push({
            columName: "UserAdded",
            columValue: logDataDTO.UserAdded,
            colType: DbSqlType.String,
        });

        var result: any = await this.mssqlDBHelper.insert(this.databaseDTO, "[mrpLogging].[dbo].[LogData]", colums,true);

        return result;

    }

}
