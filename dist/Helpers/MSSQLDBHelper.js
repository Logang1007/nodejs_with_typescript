"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = __importDefault(require("mssql"));
class MSSQLDBHelper {
    constructor() {
        //create expressjs application
        this.executeStoredProcedure = (databaseDTO, storedProcName, paramsWithOutAtInTheBeginning) => __awaiter(this, void 0, void 0, function* () {
            var returnValue;
            var pool = yield new mssql_1.default.ConnectionPool(databaseDTO).connect();
            const request = yield pool.request();
            paramsWithOutAtInTheBeginning.forEach((value, index) => {
                var colValue = this._getCleanValue(value);
                var paramName = value.columName;
                if (value.columName.indexOf("@") != -1) {
                    paramName = value.columName.substr(1);
                }
                request.input(paramName, colValue);
            });
            var result = yield request.execute(storedProcName);
            returnValue = result.recordset;
            return returnValue;
        });
        this.executeStoredProcedureWithType = function (databaseDTO, storedProcName, paramsWithOutAtInTheBeginning) {
            return __awaiter(this, void 0, void 0, function* () {
                var returnValue;
                var pool = yield new mssql_1.default.ConnectionPool(databaseDTO).connect();
                const request = yield pool.request();
                paramsWithOutAtInTheBeginning.forEach((value, index) => {
                    var colValue = this._getCleanValue(value);
                    var paramName = value.columName;
                    if (value.columName.indexOf("@") != -1) {
                        paramName = value.columName.substr(1);
                    }
                    request.input(paramName, colValue);
                });
                var result = yield request.execute(storedProcName);
                returnValue = result.recordset;
                return returnValue;
            });
        };
        this.query = (databaseDTO, sqlQuery) => __awaiter(this, void 0, void 0, function* () {
            var returnValue;
            var pool = yield new mssql_1.default.ConnectionPool(databaseDTO).connect();
            const result = yield pool.request()
                .query(sqlQuery);
            pool.close();
            returnValue = result.recordset;
            return returnValue;
        });
        this.queryWithType = function (databaseDTO, sqlQuery) {
            return __awaiter(this, void 0, void 0, function* () {
                var pool = yield new mssql_1.default.ConnectionPool(databaseDTO).connect();
                const result = yield pool.request()
                    .query(sqlQuery);
                pool.close();
                var returnValue = result.recordset;
                return returnValue;
            });
        };
        this.insert = (databaseDTO, tableName, columns, useTransaction) => __awaiter(this, void 0, void 0, function* () {
            var returnValue;
            var pool = yield new mssql_1.default.ConnectionPool(databaseDTO).connect();
            var sqlQuery = '';
            sqlQuery += "INSERT INTO " + tableName;
            sqlQuery += " (";
            columns.forEach((value, index) => {
                sqlQuery += value.columName + ",";
            });
            sqlQuery = sqlQuery.slice(0, -1);
            sqlQuery += ")";
            sqlQuery += " VALUES (";
            columns.forEach((value, index) => {
                var colValue = this._getCleanValue(value);
                sqlQuery += colValue + ",";
            });
            sqlQuery = sqlQuery.slice(0, -1);
            sqlQuery += ")";
            sqlQuery += "; SELECT @@IDENTITY AS Id";
            var fullSql = sqlQuery;
            if (useTransaction) {
                fullSql = "";
                fullSql += " BEGIN TRY\n";
                fullSql += "  BEGIN TRANSACTION\n";
                fullSql += "\n";
                fullSql += sqlQuery;
                fullSql += "\n";
                fullSql += "COMMIT\n";
                fullSql += "END TRY\n";
                fullSql += "BEGIN CATCH\n";
                fullSql += " ROLLBACK\n";
                fullSql += "  declare @ErrorMessage nvarchar(max), @ErrorSeverity int, @ErrorState int;\n";
                fullSql += " select @ErrorMessage = ERROR_MESSAGE() + ' Line ' + cast(ERROR_LINE() as nvarchar(5)), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();\n";
                fullSql += " raiserror (@ErrorMessage, @ErrorSeverity, @ErrorState);\n";
                fullSql += "END CATCH\n";
            }
            //console.log(fullSql);
            const result = yield pool.request()
                .query(fullSql);
            pool.close();
            returnValue = result.recordset;
            return returnValue;
        });
        this.update = (databaseDTO, tableName, columnsToUpdate, whereClause, useTransaction) => __awaiter(this, void 0, void 0, function* () {
            var returnValue;
            var pool = yield new mssql_1.default.ConnectionPool(databaseDTO).connect();
            var sqlQuery = '';
            sqlQuery += "UPDATE " + tableName;
            columnsToUpdate.forEach((value, index) => {
                var colValue = this._getCleanValue(value);
                if (index === 0) {
                    sqlQuery += "SET " + value.columName + "=" + colValue + ",";
                }
                else {
                    sqlQuery += value.columName + "=" + colValue + ",";
                }
            });
            sqlQuery = sqlQuery.slice(0, -1);
            sqlQuery += " " + whereClause;
            var fullSql = sqlQuery;
            if (useTransaction) {
                fullSql = "";
                fullSql += " BEGIN TRY\n";
                fullSql += "  BEGIN TRANSACTION;\n";
                fullSql += "\n";
                fullSql += sqlQuery;
                fullSql += "\n";
                fullSql += "COMMIT\n";
                fullSql += "END TRY\n";
                fullSql += "BEGIN CATCH\n";
                fullSql += " ROLLBACK\n";
                fullSql += "  declare @ErrorMessage nvarchar(max), @ErrorSeverity int, @ErrorState int;\n";
                fullSql += " select @ErrorMessage = ERROR_MESSAGE() + ' Line ' + cast(ERROR_LINE() as nvarchar(5)), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();\n";
                fullSql += " raiserror (@ErrorMessage, @ErrorSeverity, @ErrorState);\n";
                fullSql += "END CATCH\n";
            }
            //console.log(fullSql);
            const result = yield pool.request()
                .query(fullSql);
            pool.close();
            returnValue = result.recordset;
            return returnValue;
        });
        this.delete = (databaseDTO, tableName, whereClause, useTransaction) => __awaiter(this, void 0, void 0, function* () {
            var returnValue;
            var pool = yield new mssql_1.default.ConnectionPool(databaseDTO).connect();
            var sqlQuery = '';
            sqlQuery += "DELETE FROM " + tableName + " " + whereClause;
            var fullSql = sqlQuery;
            if (useTransaction) {
                fullSql = "";
                fullSql = " BEGIN TRY\n";
                fullSql = "  BEGIN TRANSACTION\n";
                fullSql += "\n";
                fullSql += sqlQuery;
                fullSql += "\n";
                fullSql += "COMMIT\n";
                fullSql += "END TRY\n";
                fullSql += "BEGIN CATCH\n";
                fullSql += " ROLLBACK\n";
                fullSql += "  declare @ErrorMessage nvarchar(max), @ErrorSeverity int, @ErrorState int;\n";
                fullSql += " select @ErrorMessage = ERROR_MESSAGE() + ' Line ' + cast(ERROR_LINE() as nvarchar(5)), @ErrorSeverity = ERROR_SEVERITY(), @ErrorState = ERROR_STATE();\n";
                fullSql += " raiserror (@ErrorMessage, @ErrorSeverity, @ErrorState);\n";
                fullSql += "END CATCH\n";
            }
            // console.log(fullSql);
            const result = yield pool.request()
                .query(fullSql);
            pool.close();
            returnValue = result.recordset;
            return returnValue;
        });
    }
    _getDate(dateValue) {
        const monthNamesList = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var dt = new Date(dateValue), dformat = [
            dt.getDate(),
            monthNamesList[dt.getMonth()],
            dt.getFullYear()
        ].join(' ') + ' ' +
            [dt.getHours(),
                dt.getMinutes(),
                dt.getSeconds()].join(':');
        return dformat;
    }
    _getCleanValue(value) {
        var colValue = "'" + value.columValue + "'";
        switch (value.colType) {
            case DbSqlType.Boolean:
            case DbSqlType.Number:
            case DbSqlType.Float:
                colValue = value.columValue;
                break;
            case DbSqlType.Date:
                colValue = "'" + this._getDate(value.columValue) + "'";
                break;
            default:
                colValue = colValue;
                break;
        }
        return colValue;
    }
}
exports.default = MSSQLDBHelper;
var DbSqlType;
(function (DbSqlType) {
    DbSqlType[DbSqlType["String"] = 0] = "String";
    DbSqlType[DbSqlType["Number"] = 1] = "Number";
    DbSqlType[DbSqlType["Float"] = 2] = "Float";
    DbSqlType[DbSqlType["Date"] = 3] = "Date";
    DbSqlType[DbSqlType["Boolean"] = 4] = "Boolean";
})(DbSqlType = exports.DbSqlType || (exports.DbSqlType = {}));
//# sourceMappingURL=MSSQLDBHelper.js.map