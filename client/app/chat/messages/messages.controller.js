'use strict';


class MessagesCtrl {

  constructor(Comm,Chat,Messages,socket,EventNotify,$scope,sideNavToggler,Auth) {
    //**************************************************************
    //Context Global variables
    this.Comm=Comm;
    this.Chat = Chat;
    this.Messages = Messages;
    this.socket = socket;
    this.selection=null;
    this.messages=[];
    this.sendText="";
    this.currentUser=Chat.getUser();
    this.requests=Chat.getRequests();
    this.membersNames='';
    this.toggleContacts=sideNavToggler.triggerToggle('contacts');
    this.toggleInfo=sideNavToggler.triggerToggle('information');
    this.roomId=null;
    this.kind=null;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.currentUser = Auth.getCurrentUser();

    //**************************************************************
    //New Message listener
    //will change
    socket.socket().on('newMessage',(doc)=>{
      Messages.newMessage(doc.roomId,doc.message);
      Chat.newMessage(doc.roomId,this.roomId,doc.kind);
    });
    //****************************************************************
    //fn being trigger when selected conversation change
    var selectionChange=()=>{
      var userSelection=Chat.getSelection();
      if(userSelection) {
        this.roomId = userSelection._id;
        if (userSelection.kind == "par") {
          this.kind = 'par';
          this.selection = userSelection.members[0];
          this.membersNames = '';
        } else {
          this.kind = 'group';
          this.selection = userSelection;
          angular.forEach(this.selection.members, (user, index)=> {
            if (index == 0)
              this.membersNames = user.name;
            else
              this.membersNames += ', ' + user.name;
          })
        }
        if(this.roomId)
          this.messages = Messages.getMessages(this.roomId);
      }else{
        this.selection =null;
      }
    };
    //Listener
    EventNotify.subscribe($scope,selectionChange);

  }
  //*****************************************************************
  //Prototype fn.
  //Send canvas by socket and endpoint
  sendCanvas =(canvasUrl)=>{
    this.socket.messageToRoom(this.roomId,{name:this.currentUser.name,text:canvasUrl,origin:this.currentUser._id,scribble:true},this.kind);
    this.Messages.newMessage(this.roomId,{name:this.currentUser.name,text:canvasUrl,origin:this.currentUser._id,scribble:true});
    this.Comm.storeMessage({id:this.currentUser._id},{name:this.currentUser.name,text:canvasUrl,roomId:this.roomId,scribble:true});
  };
  //Send new message by socket and endpoint
  addMessage = ()=>{
    if(this.sendText!=''){
      this.socket.messageToRoom(this.roomId,{name:this.currentUser.name,text:this.sendText,origin:this.currentUser._id},this.kind);
      this.Messages.newMessage(this.roomId,{name:this.currentUser.name,text:this.sendText,origin:this.currentUser._id});
      this.Comm.storeMessage({id:this.currentUser._id},{name:this.currentUser.name,text:this.sendText,roomId:this.roomId});
      this.sendText='';
    }
  };
  selectionNull = ()=>{
    this.selection=null;
  };

}


angular.module('chatYeoApp')
  .controller('MessagesCtrl', MessagesCtrl);

/*******************************************
  function Messages($scope,Messages,Comm,socket,audios,Chat,EventNotify) {
    $scope.selection=null;
    $scope.messages=[];
    this.sendText="";
    $scope.currentUser=Chat.getUser();
    $scope.membersNames='';
    //console.log($scope.currentUser._id);
    var roomId;

    var kind=null;

    function selectionChange(){
      var userSelection=Chat.getSelection();
      roomId=userSelection._id;
      if(userSelection.kind=="par") {
        kind='par';
        $scope.selection = userSelection.members[0];
      }else{
        kind='group';
        $scope.selection =userSelection;
        angular.forEach($scope.selection.members,(user,index)=>{
          if(index==0)
            $scope.membersNames=user.name;
          else
            $scope.membersNames+=', '+user.name;
        })


      }
      if(roomId)
        $scope.messages=Messages.getMessages(roomId);
    }

    EventNotify.subscribe($scope,selectionChange);

    //Function that will trigger all this information
    //watcher
  // $interval(()=>{console.log($scope.user)},300);

  /*  $scope.$watch('user._id', function(newVal, oldVal){
      roomId=$scope.user._id;
      if($scope.user.kind=="par") {
        kind='par';
        $scope.selection = $scope.user.members[0];
      }else{
        kind='group';
        $scope.selection=$scope.user;
      }
      if(roomId)
        $scope.messages=Messages.getMessages(roomId);
    });
    */

/************************************************************************
    socket.socket().on('newMessage',function(doc){
      Messages.newMessage(doc.roomId,doc.message);
      console.log($scope.sendText);
      //console.log($scope.room,doc.roomId);
      if(roomId!=doc.roomId) {
        Chat.newMessage(doc.roomId,doc.kind);
        //$scope.$emit('newMessage', {id: doc.roomId, kind: doc.kind});
        beep();
      }
    });
    $scope.addMessage = ()=>{
      console.log($scope.sendText);
      socket.messageToRoom(roomId,{name:$scope.currentUser.name,text:$scope.sendText,origin:$scope.currentUser._id},kind);
      Messages.newMessage(roomId,{name:$scope.currentUser.name,text:$scope.sendText,origin:$scope.currentUser._id});
      Comm.storeMessage({id:$scope.currentUser._id},{name:$scope.currentUser.name,text:$scope.sendText,roomId});
      //$scope.sendText='';
    };
    function beep() {
      var snd = new  Audio(audios.audio);
      snd.play();
    }
  }
 ********************************************************
*/
