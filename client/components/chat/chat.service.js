'use strict';

(function() {

  function ChatService(socket,Comm,Auth,EventNotify) {

    var groups=[];
    var rooms=[];
    var requests=[];
    var pendings=[];
    var selection={};
    var currentUser=Auth.getCurrentUser();
    var roomIndex=0;
    //$interval(()=>{console.log(currentUser._id)},600)
    //***************************************************
    //Access Instances

    //Get actual user selection
    function  getSelection(){
      return selection;
    }
    //Change selection
    function changeSelection(kind,index){
      roomIndex=index;
      if(kind=="par"){
        selection=rooms[index];
        rooms[index].newMessage=false;
      }
      else{
        selection=groups[index];
        groups[index].newMessage=false;
      }
      EventNotify.notify();
    }
    //Get rooms Instance
    function getRooms(){
      return rooms
    }
    //Get request Instance
    function getRequests(){
      return requests
    }
    //Get pending Instance
    function getPendings(){
      return pendings
    }
    //Get Groups Instance
    function getGroups(){
      return groups
    }
    //Get Current User
    function getUser(){
      return currentUser;
    }
    //*****************************************************
    //Add Request Conversation
    function newRequest(user) {
      pendings.push(user);
      //socket.addRoom(room._id);
      EventNotify.notify();
      // $scope.toggleAddContact();
    }
    //Add Request Conversation
    function rejectRequest(userId) {
      requests.splice(requests.indexOf(userId),1);
      //socket.addRoom(room._id);
      EventNotify.notify();
      // $scope.toggleAddContact();
    }
    //Add Friend Conversation
    function newFriend(room) {
      rooms.push(room);
      requests.splice(requests.indexOf(room.members[0]._id),1);
      //socket.addRoom(room._id);
      EventNotify.notify();
      // $scope.toggleAddContact();
    }

    //Add Group Conversation
    function newGroup(group) {
      groups.push(group);
      socket.addRoom(group._id);
      EventNotify.notify();
    }
      /*deleteFriend
        *Delete Friend
        * Right now receive an event an erase friend internally
        * will request the whole friends instead in a future
      */
    function deleteFriend(room) {
      Comm.deleteRoom(room).then(()=> {
        var index = rooms.indexOf(room._id);
        rooms.splice(index, 1);
      });
    }
    //Delete Friend From Group
    function deleteFriendFromGroup(room) {
      Comm.deleteFriendFromGroup(room).then(()=> {

        //$scope.toggleInfo();
      });
    }
    //add Friend to Group
    function addFriendToGroup(room) {
      Comm.addFriendToGroup(room).then(()=> {
        //$scope.toggleInfo();
      });
    }
    //Delete Group
    function deleteGroup(room) {
      Comm.deleteGroup(room).then(()=> {
        //$scope.toggleInfo();
      });
    }
    //Exit Group
    function exitGroup(room) {
      Comm.exitGroup(room).then(()=> {
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
            groups.push(...contacts[0].rooms);

            changeSelection('par', 0);
          });
      });
    }

    //****************************************************
    //Notify user about new message
    function newMessage(roomId, kind) {
      var index = null;
      var lookArr;
      if (kind == "par")
        lookArr = rooms;
      else
        lookArr = groups;

      angular.forEach(lookArr, (value, ind)=> {
        if (roomId === value._id) {
          index = ind;
          return true
        }
      });
      console.log(lookArr[index], index);
      lookArr[index].newMessage = true;
    }

    //****************************************************
    //reset Chat Service
    function reset() {
      groups.length = 0;
      rooms.length = 0;
      requests.length= 0;
      pendings.length= 0;
      currentUser=Auth.getCurrentUser();
      selection={};
      socket.socket();
      //*****************************************************
      //Get Rooms for groups and par conversations
      Comm.getRooms({id: currentUser._id, kind: 'par'})
        .then(contacts=> {
          rooms.push(...contacts[0].rooms);
        });
      Comm.getRooms({id: currentUser._id, kind: 'group'})
        .then(contacts=> {
          groups.push(...contacts[0].rooms);
        });
      //*****************************************************
      //Get Rooms for groups and par conversations
      Comm.getRequestPendings({id: currentUser._id})
        .then(doc=> {
          console.log(doc.pendings);
          pendings.push(...doc.pendings);
          requests.push(...doc.requests);
        });

      //*******************************************
      //Config Listeners

      //Get new request information
      socket.listener('room:newRequest', (doc)=> {
        //socket.addRoom(doc._id);
        requests.push(doc);
      });
      //Get REJECT information
     /* socket.listener('room:tellFriendRejected', (doc)=> {
        //socket.addRoom(doc._id);
        pendings.splice(pendings.indexOf(doc.members[0]._id),1);
      });
*/
      //Get new friend information
      socket.listener('room:tellFriendAccepted', (doc)=> {
        //socket.addRoom(doc._id);
        rooms.push(doc);
        pendings.splice(pendings.indexOf(doc.members[0]._id),1);
      });

      //Get new group information
      socket.listener('room:newGroup', (doc)=> {
        //socket.addRoom(doc._id);
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
           // console.log(contacts);
            groups.push(...contacts[0].rooms);
          });
      });
      //Delete friend that delete you
      socket.listener('room:deleteFriend', (roomId)=> {
        var index = rooms.indexOf(roomId);
        rooms.splice(index, 1);
      });

      //Friend Being removed from conversation
      socket.listener('room:tellFriendRemoved', (doc)=> {
        //Will change all request
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {

            groups.length = 0;

            groups.push(...contacts[0].rooms);

            console.log(currentUser._id==doc.friendId,doc,currentUser._id)
            if (currentUser._id==doc.friendId) {
               changeSelection('par', 0);
            }else{
               changeSelection('group', roomIndex);
            }
          });
      });

      //User leave Conversation
      socket.listener('room:tellFriendExit', (doc)=> {
        //Will change all request
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
            console.log(contacts);
            groups.push(...contacts[0].rooms);
            changeSelection('groups', roomIndex);

          });
      });
      //Group Deleted
      socket.listener('room:tellGroupDeleted', (doc)=> {
        //Will change all request
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
            console.log(contacts);
            groups.push(...contacts[0].rooms);
            changeSelection('par', 0);

          });
      });
      //Group Deleted
      socket.listener('room:tellGroupAddedFriend', (doc)=> {
        //Will change all request
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
            console.log(contacts);
            groups.push(...contacts[0].rooms);
            changeSelection('group',roomIndex);

          });
      });

      //Receive notification when a friend go online
      socket.listener('room:changeStatus', (roomId)=> {
        var index;
        console.log('connect');
        angular.forEach(rooms, (val, ind)=> {
          if (val._id == roomId) {
            index = ind;
            return true
          }
        });
       // console.log(cache.rooms[index], rooms);
        rooms[index].members[0].status = 'Online';

      });
      //Receive offline status
      socket.listener('userDisconnect', (roomId)=> {
        //var index;
        console.log('disconnect');
        angular.forEach(rooms, (val, ind)=> {
          console.log(val._id, rooms);
          if (val._id == roomId) {
            rooms[ind].members[0].status = 'Offline';
            return true
          }
        });
        //console.log(index);

      });
      //******************************************
      //Subscribe socket to all rooms(inside the server)
      socket.joinRooms();
      //**********************
    }
    var Chat = {
      newFriend,
      newGroup,
      newRequest,
      rejectRequest,
      deleteFriend,
      newMessage,
      getSelection,
      getRooms,
      getGroups,
      getRequests,
      getPendings,
      changeSelection,
      getUser,
      reset,
      deleteGroup,
      addFriendToGroup,
      deleteFriendFromGroup,
      exitGroup
    };

    return Chat;
  }

  angular.module('chatYeoApp')
    .factory('Chat', ChatService);

})();


