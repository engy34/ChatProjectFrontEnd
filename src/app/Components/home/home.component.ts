import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { HubConnectionState } from '@microsoft/signalr/dist/esm/HubConnection';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Group, GroupUsers, User, message } from 'src/app/Models/user';
import { SignalrService } from 'src/app/Services/signalr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    public signalrService: SignalrService
  ) { }
  users: Array<User> = new Array<User>();
  groups: Array<Group> = new Array<Group>();
  usersList: Array<GroupUsers> = new Array<GroupUsers>();
  basicUser: GroupUsers = new GroupUsers();
  selectedUser: User = new User();
  selectedGroup: Group = new Group();
  msg: string = "";
  msGrp: string = "";
  selectedUsersForGroup: Array<User> = new Array<User>();
  dropdownSettings: IDropdownSettings = {};
  isShownGroup: Boolean = false;
  isShownUser: Boolean = true;
  popup: boolean = false;
  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.userOnLis();
    this.userOfList();
    this.logOutLis();
    this.sendMsgLis();
    this.sendMsgGrpLis();
    this.getAvailableGroupsLis();
    this.getOnlineUsersLis();
    this.GetUserMsgsLis();
    this.GetUserGrpMsgsLis();
    this.CreateGroupLis();
    if (this.signalrService.hubConnection.state == HubConnectionState.Connected) { //if already connected
      this.getOnlineUsersInv();
      this.getAvailableGroupsInv();
    }
  }
  logOut() {

    this.signalrService.hubConnection.invoke("logOut", this.signalrService.userData.id)
      .catch(err => console.error(err))
  }
  logOutLis(): void {
    this.signalrService.hubConnection.on("logoutResponse", () => {
      localStorage.removeItem("personId");
      location.reload();

    });
  }
  ToggleChatBox(toggleType: any) {
    if (toggleType == 1) {
      this.isShownUser = true;
      this.isShownGroup = false;
    }
    else {
      this.isShownUser = false;
      this.isShownGroup = true;
    }
  }
/*   private toggleGrpChatBox() {
    this.isShownUser = !this.isShownUser;
    this.isShownGroup = !this.isShownGroup;
  } */
  private userOnLis(): void {
    this.signalrService.hubConnection.on("userOn", (newUser: User) => {

      this.users.push(newUser);
    })

  }
  private userOfList(): void {
    this.signalrService.hubConnection.on("useroff", (personId: string) => {
      this.users = this.users.filter(u => u.id != personId);
    })
  }
  private getOnlineUsersInv(): void {
    this.signalrService.hubConnection.invoke("getOnlineUsers")
      .catch(err => console.log(err));

  }
  private getOnlineUsersLis(): void {
    this.signalrService.hubConnection.on("getOnlineUsersResponse", (OnlineUsers: Array<User>) => {
      console.log(OnlineUsers);
      this.users = [...OnlineUsers];
    });
  }
  private getAvailableGroupsInv(): void {

    this.signalrService.hubConnection.invoke("getAvailableGroups", this.signalrService.userData.id)
      .catch(err => console.log(err));

  }
  private getAvailableGroupsLis(): void {
    this.signalrService.hubConnection.on("getAvailableGroupsResponse", (availableGroups: Array<Group>) => {

      this.groups = [...availableGroups];

    });
  }
  public sendMsgInv(): void {
    console.log( this.selectedUser);
    if (this.msg?.trim() === "" || this.msg == null) return;
    this.signalrService.hubConnection.invoke("sendMsg", this.signalrService.userData.id, this.selectedUser?.connId, this.msg)
      .catch(err => console.error(err));
    if (this.selectedUser?.msgs == null) this.selectedUser.msgs = [];
    this.selectedUser?.msgs.push(new message(this.msg, true, this.selectedUser.name, "", "",""));
    this.msg = ""
  }
  private sendMsgLis(): void {
    this.signalrService.hubConnection.on("sendMsgResponse", (connId: string, msg: string) => {
      let receiver = this.users.find(u => u.connId === connId);
      if (receiver?.msgs == null) receiver!.msgs = [];

      receiver?.msgs.push(new message(msg, false, "", "", "",""));

    })
  }
  public sendMsgGrpInv(): void {
    if (this.msGrp?.trim() === "" || this.msGrp == null) return;
    this.signalrService.hubConnection.invoke("SendGrpMsg", this.signalrService.userData.id, this.selectedGroup?.groupId, this.msGrp)
      .catch(err => console.error(err));

    if (this.selectedGroup?.msgs == null) this.selectedGroup.msgs = [];


    this.selectedGroup?.msgs.push(new message(this.msGrp, true, this.signalrService.userData.name, "", "",""));

    console.log(this.selectedGroup.msgs)
    this.msGrp = ""
  }
  private sendMsgGrpLis(): void {
    console.log("beforeSig")
    this.signalrService.hubConnection.on("SendGrpMsgResponse", (senderName: string, groupId: string, msg: string) => {

      console.log('Received message: ', msg);
      let receiverGrp = this.groups.find(u => u.groupId === groupId);
      if (receiverGrp?.msgs == null) receiverGrp!.msgs = [];

      receiverGrp?.msgs.push(new message(msg, false, senderName, "", "",""));
      console.log(receiverGrp?.msgs)

    })
  }
  public CreateGroup = (groupName: string) => {

    this.usersList = this.selectedUsersForGroup.map(item => {
      return {
        UserId: item.id,
        ConnId: this.users.filter(x => x.id == item.id)[0].connId,
        GroupName: groupName,


      };
    });
    this.basicUser =
    {
      UserId: this.signalrService.userData.id,
      ConnId: this.signalrService.userData.connId,
      GroupName: groupName,

    }
    this.usersList.push(this.basicUser);
    console.log(this.usersList)
    this.signalrService.hubConnection.invoke('CreateGroup', this.usersList)
      .catch(err => console.error('Error while creating group: ', err));
  }
  private CreateGroupLis(): void {
    this.signalrService.hubConnection.on("GroupCreatedResponse", (CreatedGroup: Group) => {
      this.groups.push(CreatedGroup);
    });
  }
  public GetUserMsgs(id: string): void {
    this.signalrService.hubConnection.invoke("GetUserMsgs", this.signalrService.userData.id, id)
      .catch(err => console.error(err));

  }
  private GetUserMsgsLis(): void {
    this.signalrService.hubConnection.on("GetUserMsgsResponse", (SelecUserMsgs: Array<message>) => {
      SelecUserMsgs.forEach((msg) => {
        if (this.selectedUser?.msgs == null) this.selectedUser.msgs = [];
        if (msg.receiverId == this.signalrService.userData.id) { this.selectedUser?.msgs.push(new message(msg.msg, false, "", "", msg.receiverId,"")); }
        else { this.selectedUser?.msgs.push(new message(msg.msg, true, "", "", msg.msg,"")); }
      });
      console.log(this.selectedUser?.msgs);
    });
  }

  public GetUserGrpMsgs(Grpid: string): void {
    this.signalrService.hubConnection.invoke("GetUserGrpMsgs",Grpid)
      .catch(err => console.error(err));

  }
  private GetUserGrpMsgsLis(): void {
    this.signalrService.hubConnection.on("GetUserMsgsResponse", (SelecUserGrpMsgs: Array<message>) => {
      console.log(SelecUserGrpMsgs);
      SelecUserGrpMsgs.forEach((msgGrp) => {
        let userName=this.users.find(u=>u.id==msgGrp.userId)?.name??"";
        if (this.selectedGroup?.msgs == null) this.selectedGroup.msgs = [];
        if (msgGrp.userId == this.signalrService.userData.id) { this.selectedGroup?.msgs.push(new message(msgGrp.msg, true, userName, "", msgGrp.receiverId,"")); }
        else { this.selectedGroup?.msgs.push(new message(msgGrp.msg, false, userName, "", msgGrp.receiverId,"")); }
      });
     
    });
  }
}
