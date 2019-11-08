"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
require("./Helpers/env");
const LoggingService_1 = __importDefault(require("./Service/LoggingService"));
const DatabaseDTO_1 = __importDefault(require("./Models/DatabaseDTO"));
class Server {
    constructor() {
        this.apiRoute = "/api";
        this.databaseDTO = new DatabaseDTO_1.default();
        this.loggingService = new LoggingService_1.default();
        //create expressjs application
        this.app = express_1.default();
        this.setUpDatabaseConfig();
        this.loggingService.apiRoute = this.apiRoute;
        this.loggingService.app = this.app;
        this.loggingService.databaseDTO = this.databaseDTO;
        //configure application
        this.startUp();
        this.setUpRoutes();
    }
    static bootstrap() {
        return new Server();
    }
    startUp() {
        this.app.listen(process.env.PORT, () => console.log(`mrpLogging listening on port ${process.env.PORT}!`));
    }
    setUpRoutes() {
        this.loggingService.getLogData();
        this.loggingService.addLog();
    }
    setUpDatabaseConfig() {
        this.databaseDTO.server = process.env.DBServer;
        this.databaseDTO.database = process.env.DBName;
        this.databaseDTO.user = process.env.DBUserName;
        this.databaseDTO.password = process.env.DBPassword;
    }
}
var server = Server.bootstrap();
module.exports = server.app;
//# sourceMappingURL=server.js.map