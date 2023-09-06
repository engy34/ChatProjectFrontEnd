export class User {
   public id: string = "";
   public name: string = "";
   public connId: string = "";
   public msgs: Array<message> = [];
}
export class message {

    constructor(public msg: string,public  mine: boolean ,public userName: string,public groupId: string,public receiverId:string,public userId:string){};
}
export class Group {
   public groupId: string = "";
   public groupName: string = "";
   public groupConnId: string = "";
   public users: Array<User> = [];
   public msgs: Array<message> = [];
}
export class GroupUsers {
   public UserId: string = "";
   public ConnId: string = "";
   public GroupName: string = "";

};
