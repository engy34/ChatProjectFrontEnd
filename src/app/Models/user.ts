export class User {
   public id: string = "";
   public name: string = "";
   public connId: string = "";
   public msgs: Array<message> = [];
}
export class message {

   constructor(public content: string, public mine: boolean = false, public userName: string, public groupId: string) {


   }
 
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

   /*    public GroupId:string="" */
};
