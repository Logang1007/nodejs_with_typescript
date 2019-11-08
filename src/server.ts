import express from 'express';
import "./Helpers/env"
import LoggingService from './Service/LoggingService';
import DatabaseDTO from './Models/DatabaseDTO';


class Server {
    private apiRoute: string = "/api";
    public app: express.Application;
    public databaseDTO: DatabaseDTO = new DatabaseDTO();
    
  
    private loggingService=new LoggingService();

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        //create expressjs application
        this.app = express();
        this.setUpDatabaseConfig();
        this.loggingService.apiRoute = this.apiRoute;
        this.loggingService.app = this.app;
        this.loggingService.databaseDTO = this.databaseDTO;
        //configure application
        this.startUp();
        this.setUpRoutes();
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
export = server.app;










