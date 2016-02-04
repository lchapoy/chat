'use strict';




class AddGroupCtrl {
  //start-non-standard
  errors = {};
  answer = {};
  arrId=[];
  //end-non-standard

  constructor($scope,Comm) {
    this.Comm=Comm;
    this.scope = $scope;
    /*$scope.$on('allFriends', function(event, friends ){
     $scope.friends=friends;
      console.log(friends);
    });*/
  }
  message = 'Hello';
  newGroup = function (groupName) {
    if(this.arrId.length==0){
      //Show user add some friends in order to create a group
    }else if(groupName==''||groupName=='undefined'){
      //Show user that a name is needed
    }else{
      console.log(this.arrId)
      this.Comm.createGroup({groupName:groupName,membersId:this.arrId})
        .then((res)=> {
          this.scope.$emit('newGroup', {data:res});
          console.log(res);
        })
    }
    console.log(this.arrId)
  };
  addMemberId =function(id){
    console.log(id);
    this.arrId.push(id);
  };
  removeMemberId =function(id){
    var index=this.arrId.indexOf(id)
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
