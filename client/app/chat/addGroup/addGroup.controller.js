'use strict';




class AddGroupCtrl {
  //start-non-standard
  errors = {};
  answer = {};
  arrId=[];
  //end-non-standard

  constructor($scope,Comm,Chat) {
    this.Comm=Comm;
    this.scope = $scope;
    this.Chat=Chat;
    this.rooms=Chat.getRooms();
  }
  message = 'Hello';
  newGroup = function (groupName) {
    if(this.arrId.length==0){
      //Show user add some friends in order to create a group
    }else if(groupName==''||groupName==undefined){
      //Show user that a name is needed
    }else{
      //console.log(this.arrId)
      this.Comm.createGroup({groupName:groupName,membersId:this.arrId,img:"/assets/images/group_no_image.png"})
        .then((group)=> {
          //this.scope.$emit('newGroup', {data:res});
          this.Chat.newGroup(group);
          console.log(group);
        })
    }
    console.log(this.arrId)
  };
  addMemberId =function(id){
    console.log(id);
    this.arrId.push(id);
  };
  removeMemberId =function(id){
    var index=this.arrId.indexOf(id);
    this.arrId.splice(index,1);
  };
  myFilter = function (item) {
    return item === false || item === 'undefined';
  };
 /* sendNewGroup= function(group)  { // for some event.
    return {name: 'newGroup', data: group};
  };*/


}

angular.module('chatYeoApp')
  .controller('AddGroupCtrl',AddGroupCtrl);
