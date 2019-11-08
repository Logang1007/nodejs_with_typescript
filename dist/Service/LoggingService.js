"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MSSQLDBHelper_1 = __importStar(require("../Helpers/MSSQLDBHelper"));
const HttpHelper_1 = __importDefault(require("../Helpers/HttpHelper"));
class LoggingService {
    constructor() {
        this.apiRoute = "";
        this.getLogData = () => __awaiter(this, void 0, void 0, function* () {
            var self = this;
            this.httpHelper.getJson(this.app, this.apiRoute + '/GetLogData/:appId', function (req, res) {
                return __awaiter(this, void 0, void 0, function* () {
                    var appId = req.params.appId;
                    let result = yield self.getLogDataFromDB(appId);
                    res.statusCode = 200;
                    res.send(result);
                });
            });
        });
        this.addLog = () => __awaiter(this, void 0, void 0, function* () {
            var self = this;
            this.httpHelper.postJson(this.app, this.apiRoute + '/AddLog', true, function (req, res, bodyJsonData) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        var datObj = bodyJsonData;
                        let result = yield self.addLogData(datObj);
                        res.statusCode = 200;
                        res.send(result);
                    }
                    catch (ex) {
                        res.statusCode = 500;
                        res.send(ex);
                    }
                });
            });
        });
        this.getLogDataFromDB = (appId) => __awaiter(this, void 0, void 0, function* () {
            var returnValue;
            var colums = [];
            colums.push({
                columName: "LogApplicationId",
                columValue: appId,
                colType: MSSQLDBHelper_1.DbSqlType.Number,
            });
            returnValue = yield this.mssqlDBHelper.executeStoredProcedureWithType(this.databaseDTO, "[dbo].[GetLogDataByApplicationId]", colums);
            //returnValue = result as Array<LogDataDTO>;
            return returnValue;
        });
        this.addLogData = (logDataDTO) => __awaiter(this, void 0, void 0, function* () {
            var colums = [];
            colums.push({
                columName: "LogSeverityId",
                columValue: logDataDTO.LogSeverityId,
                colType: MSSQLDBHelper_1.DbSqlType.Number,
            });
            colums.push({
                columName: "LogTypeId",
                columValue: logDataDTO.LogTypeId,
                colType: MSSQLDBHelper_1.DbSqlType.Number,
            });
            colums.push({
                columName: "Code",
                columValue: logDataDTO.Code,
                colType: MSSQLDBHelper_1.DbSqlType.String,
            });
            colums.push({
                columName: "ModuleName",
                columValue: logDataDTO.ModuleName,
                colType: MSSQLDBHelper_1.DbSqlType.String,
            });
            colums.push({
                columName: "Request",
                columValue: logDataDTO.Request,
                colType: MSSQLDBHelper_1.DbSqlType.String,
            });
            colums.push({
                columName: "Response",
                columValue: logDataDTO.Response,
                colType: MSSQLDBHelper_1.DbSqlType.String,
            });
            colums.push({
                columName: "Data",
                columValue: logDataDTO.Data,
                colType: MSSQLDBHelper_1.DbSqlType.String,
            });
            colums.push({
                columName: "DateAdded",
                columValue: new Date(),
                colType: MSSQLDBHelper_1.DbSqlType.Date,
            });
            colums.push({
                columName: "UserAdded",
                columValue: logDataDTO.UserAdded,
                colType: MSSQLDBHelper_1.DbSqlType.String,
            });
            var result = yield this.mssqlDBHelper.insert(this.databaseDTO, "[mrpLogging].[dbo].[LogData]", colums, true);
            return result;
        });
        this.mssqlDBHelper = new MSSQLDBHelper_1.default();
        this.httpHelper = new HttpHelper_1.default();
    }
}
exports.default = LoggingService;
//# sourceMappingURL=LoggingService.js.map