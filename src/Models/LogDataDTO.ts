export interface LogDataDTO {
    LogDataId: string;
    LogSeverity: string;
    LogType: string;
    ApplicationName: string;
    LogSeverityId: LogSeverityId;
    LogTypeId: LogType;
    Code: string;
    ModuleName:string;
    Request: string;
    Response: string;
    Data: string;
    DateAdded: Date;
    UserAdded: string;
}

export enum LogSeverityId {
    Low = 1,
    Meduim = 2,
    High = 3,
    Critical=4
}

export enum LogType {
    Error = 1,
    Debug = 2,
    Warning = 3,
    Info = 4
}

