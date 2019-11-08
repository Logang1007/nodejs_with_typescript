
import DatabaseDTO from '../Models/DatabaseDTO';

import ConnectionPool from 'mssql';

export default class MSSQLDBHelper {



    constructor() {
        //create expressjs application

    }


    private _getDate(dateValue: any) {
        const monthNamesList = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        var dt = new Date(dateValue),
            dformat = [
                dt.getDate(),
                monthNamesList[dt.getMonth()],
                dt.getFullYear()].join(' ') + ' ' +
                [dt.getHours(),
                dt.getMinutes(),
                    dt.getSeconds()].join(':');

        return dformat;

    }

    private _getCleanValue(value: InsertRecord) {
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

    executeStoredProcedure = async (databaseDTO: DatabaseDTO, storedProcName: string, paramsWithOutAtInTheBeginning: Array<InsertRecord>) => {
        var returnValue;
        var pool = await new ConnectionPool.ConnectionPool(databaseDTO).connect();
        const request = await pool.request();

        paramsWithOutAtInTheBeginning.forEach((value, index) => {
            var colValue = this._getCleanValue(value);
            var paramName = value.columName;
            if (value.columName.indexOf("@") != -1) {
                paramName = value.columName.substr(1);
            }
            request.input(paramName,colValue);
        });

        var result = await request.execute(storedProcName);
        returnValue = result.recordset;
        return returnValue;
    }

    executeStoredProcedureWithType = async function <T>(databaseDTO: DatabaseDTO, storedProcName: string, paramsWithOutAtInTheBeginning: Array<InsertRecord>): Promise<any> {
        var returnValue:any;
        var pool = await new ConnectionPool.ConnectionPool(databaseDTO).connect();
        const request = await pool.request();

        paramsWithOutAtInTheBeginning.forEach((value, index) => {
            var colValue = this._getCleanValue(value);
            var paramName = value.columName;
            if (value.columName.indexOf("@") != -1) {
                paramName = value.columName.substr(1);
            }
            request.input(paramName, colValue);
        });

        var result = await request.execute(storedProcName);
        returnValue = result.recordset as unknown as T;
        return returnValue;
    }


    query = async (databaseDTO: DatabaseDTO, sqlQuery: string) => {
        var returnValue;
        var pool = await new ConnectionPool.ConnectionPool(databaseDTO).connect();
        const result = await pool.request()
            .query(sqlQuery);
        pool.close();

        returnValue = result.recordset;

        return returnValue;

    }

    queryWithType = async function <T>(databaseDTO: DatabaseDTO, sqlQuery: string): Promise<any> {
        
        var pool = await new ConnectionPool.ConnectionPool(databaseDTO).connect();
        const result = await pool.request()
            .query(sqlQuery);
        pool.close();

        var returnValue:any = result.recordset as unknown as T;

        return returnValue;
    }
    

    insert = async (databaseDTO: DatabaseDTO, tableName: string, columns: Array<InsertRecord>, useTransaction: boolean) => {
        var returnValue;
        var pool = await new ConnectionPool.ConnectionPool(databaseDTO).connect();
       
        var sqlQuery: string = '';
        sqlQuery += "INSERT INTO " + tableName;
        sqlQuery += " ("
        columns.forEach((value, index) => {
            sqlQuery += value.columName + ",";
        });
        sqlQuery = sqlQuery.slice(0, -1);
        sqlQuery += ")";

        sqlQuery += " VALUES ("

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
        const result = await pool.request()
            .query(fullSql);
        pool.close();

       returnValue = result.recordset;


        return returnValue;

    }

    update = async (databaseDTO: DatabaseDTO, tableName: string, columnsToUpdate: Array<InsertRecord>,whereClause:string,useTransaction:boolean) => {
        var returnValue;
        var pool = await new ConnectionPool.ConnectionPool(databaseDTO).connect();

        var sqlQuery: string = '';
        
        sqlQuery += "UPDATE " + tableName;
        columnsToUpdate.forEach((value, index) => {
            var colValue = this._getCleanValue(value);
            if (index === 0) {
                sqlQuery += "SET " + value.columName + "=" + colValue + ",";
            } else {
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
        const result = await pool.request()
            .query(fullSql);
        pool.close();

        returnValue = result.recordset;


        return returnValue;

    }

    delete = async (databaseDTO: DatabaseDTO, tableName: string, whereClause: string, useTransaction: boolean) => {
        var returnValue;
        var pool = await new ConnectionPool.ConnectionPool(databaseDTO).connect();

        var sqlQuery: string = '';

        sqlQuery += "DELETE FROM " + tableName +" "+ whereClause;

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
        const result = await pool.request()
            .query(fullSql);
        pool.close();

        returnValue = result.recordset;


        return returnValue;

    }

}

export interface InsertRecord {
    columName: string;
    columValue: any;
    colType: DbSqlType;
}

export enum DbSqlType {
    String,
    Number,
    Float,
    Date,
    Boolean,
}

