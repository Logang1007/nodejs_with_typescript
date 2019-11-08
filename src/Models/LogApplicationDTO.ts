export interface  LogApplicationDTO {
    LogApplicationObject: LogApplicationObject[];

}

export class LogApplicationObject {

    LogApplicationId: number = 0;
    SecurityApplicationId: string = '';
    Description: string = '';
    IsActive: boolean = false;
    DateAdded: Date;
    UserAdded: string = '';
}



