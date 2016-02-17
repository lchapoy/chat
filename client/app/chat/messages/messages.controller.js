'use strict';


class MessagesCtrl {

  constructor(Comm,Chat,Messages,socket,audios,EventNotify,$scope) {
    this.Comm=Comm;
    this.Chat = Chat;
    this.Messages = Messages;
    this.socket = socket;

    this.selection=null;
    this.messages=[];
    this.sendText="";
    this.currentUser=Chat.getUser();
    this.membersNames='';
    //console.log($scope.currentUser._id);
    this.roomId;
    this.kind=null;
    /*this.beep= ()=>{
      var snd = new  Audio(audios.audio);
      snd.play();
    }*/
    EventNotify.subscribe($scope,this.selectionChange);
    socket.socket().on('newMessage',function(doc){
      Messages.newMessage(doc.roomId,doc.message);
      if(this.roomId!=doc.roomId) {
        Chat.newMessage(doc.roomId,doc.kind);
        //this.beep();
      }
    });

  }

  selectionChange=()=>{
    var userSelection=this.Chat.getSelection();
    this.roomId=userSelection._id;
    if(userSelection.kind=="par") {
      this.kind='par';
      this.selection = userSelection.members[0];
    }else{
      this.kind='group';
      this.selection =userSelection;
      angular.forEach(this.selection.members,(user,index)=>{
        if(index==0)
          this.membersNames=user.name;
        else
          this.membersNames+=', '+user.name;
      })


    }
    if(this.roomId)
      this.messages=this.Messages.getMessages(this.roomId);
  };


  sendCanvas =(canvasUrl)=>{
    this.socket.messageToRoom(this.roomId,{name:this.currentUser.name,text:canvasUrl,origin:this.currentUser._id,scribble:true},this.kind);
    this.Messages.newMessage(this.roomId,{name:this.currentUser.name,text:canvasUrl,origin:this.currentUser._id,scribble:true});
    this.Comm.storeMessage({id:this.currentUser._id},{name:this.currentUser.name,text:canvasUrl,roomId:this.roomId,scribble:true});
  };

  addMessage = ()=>{
    this.socket.messageToRoom(this.roomId,{name:this.currentUser.name,text:this.sendText,origin:this.currentUser._id},this.kind);
    this.Messages.newMessage(this.roomId,{name:this.currentUser.name,text:this.sendText,origin:this.currentUser._id});
    this.Comm.storeMessage({id:this.currentUser._id},{name:this.currentUser.name,text:this.sendText,roomId:this.roomId});
   this.sendText='';
  };

  imageClick =(dataUrl)=>{

  }


}


angular.module('chatYeoApp')
  .constant("audios",{audio:"data:audio/wav;base64,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" +
  "KmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJ" +
  "E0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6E" +
  "lLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMak" +
  "eAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3" +
  "r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+" +
  "eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWta" +
  "z58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFh" +
  "IaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFR" +
  "YWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb//////////////////////////////////////////////////////////////////" +
  "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////" +
  "///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////" +
  "///////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93" +
  "d3cuc291bmRib3kuZGUAAAAAAAAAACU="})
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
