'use strict';

(function() {

  function ChatService(socket,Comm,Auth,EventNotify) {

    var groups=[];
    var rooms=[];
    var requests=[];
    var pendings=[];
    var selection=null;
    var currentUser=Auth.getCurrentUser();
    //***************************************************
    //Access Instances
    function getIndex(arr,val1){
      var index=0;
      angular.forEach(arr,(item,ind)=>{
        if(item._id==val1){
          index=ind;
          return true
        }
      });
      return arr[index]
    }
    //Get actual user selection
    function  getSelection(){
      return selection;
    }
    //Change selection
    function changeSelection(kind,room){
      if(!kind)
        selection=null;
      else {
        selection=room;
        room.newMessage=false;
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
      EventNotify.notify();
    }
    //Add Request Conversation
    function rejectRequest(userId) {
      angular.forEach(rooms,(item,ind)=>{
        if(item._id==userId){
          requests.splice(ind,1);
          return true
        }
      });
      EventNotify.notify();
    }
    //Add Friend Conversation
    function newFriend(room) {
      rooms.push(room);

      //var x=requests.splice(requests.indexOf(room.members[0]._id),1);
      angular.forEach(requests,(item,ind)=>{
        if(item._id==room.members[0]._id){
          requests.splice(ind, 1);
          return true
        }
      });
      EventNotify.notify();
    }

    //Add Group Conversation
    function newGroup(group) {
      groups.push(group);
      //socket.addRoom(group._id);
      changeSelection('group',  getIndex(groups,group._id));
    }

    //Delete Friend
    function deleteFriend(room) {
      Comm.deleteRoom(room).then(()=> {
        angular.forEach(rooms,(item,ind)=>{
          if(item._id==room.id){
            rooms.splice(ind, 1);
            return true
          }
        });
        changeSelection(null, null);
      });
    }
    //Delete Friend From Group
    function deleteFriendFromGroup(room) {
      Comm.deleteFriendFromGroup(room).then(()=> {
      });
    }
    //add Friend to Group
    function addFriendToGroup(room) {
      Comm.addFriendToGroup(room).then(()=> {
      });
    }
    //Delete Group
    function deleteGroup(room) {
      Comm.deleteGroup(room).then(()=> {
      });
    }
    //Exit Group
    function exitGroup(room) {
      Comm.exitGroup(room).then(()=> {
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
            groups.push(...contacts[0].rooms);
            changeSelection(null, null);
          });
      });
    }

    //****************************************************
    //Notify user about new message
    function newMessage(roomId,actualRoomId,kind) {
      var lookArr;
      if (kind == "par")
        lookArr = rooms;
      else
        lookArr = groups;
      angular.forEach(lookArr, (value, ind)=> {
        if (roomId === value._id) {
          lookArr[ind].lastMessageDate_ms = Date.now();
          if(roomId!=actualRoomId)
            lookArr[ind].newMessage = true;
          return true
        }
      });
    }

    //****************************************************
    //reset Chat Service
    function reset() {
      groups.length = 0;
      rooms.length = 0;
      requests.length= 0;
      pendings.length= 0;
      currentUser=Auth.getCurrentUser();
      selection=null;
      //get socket instance
      socket.socket();
      //*****************************************************
      //Get Rooms for groups and par conversations
      Auth.getCurrentUser(()=>{
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
            pendings.push(...doc.pendings);
            requests.push(...doc.requests);
          });
      });


      //*******************************************
      //Config Listeners

      //Get new request information
      socket.listener('room:newRequest', (doc)=> {
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
        rooms.push(doc);
        pendings.splice(pendings.indexOf(doc.members[0]._id),1);
      });

      //Get new group information
      socket.listener('room:newGroup', ()=> {
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
            groups.push(...contacts[0].rooms);
          });
      });
      //Delete friend that delete you
      socket.listener('room:deleteFriend', (roomId)=> {
        angular.forEach(rooms, (val,ind)=> {
          if (val._id == roomId) {
            rooms.splice(ind,1);
            return true
          }
        });
      });

      //Friend Being removed from conversation
      socket.listener('room:tellFriendRemoved', (doc)=> {
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
            groups.push(...contacts[0].rooms);
            if(doc.roomId== selection._id)
              if (currentUser._id==doc.friendId) {
                 changeSelection(null, null);
              }else{
                 changeSelection('group',  getIndex(groups,selection._id));
              }
          });
      });

      //User leave Conversation
      socket.listener('room:tellFriendExit', (doc)=> {
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
            groups.push(...contacts[0].rooms);
            if(doc.roomId== selection._id)
              changeSelection('group', getIndex(groups,selection._id));
          });
      });

      //Group Deleted
      socket.listener('room:tellGroupDeleted', (doc)=> {
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
            console.log(contacts);
            groups.push(...contacts[0].rooms);
            if(doc===selection._id)
              changeSelection(null, null);

          });
      });
      //Group Deleted
      socket.listener('room:tellGroupAddedFriend', (doc)=> {
        Comm.getRooms({id: currentUser._id, kind: 'group'})
          .then(contacts=> {
            groups.length = 0;
            console.log(contacts);
            groups.push(...contacts[0].rooms);
            if(doc===selection._id)
              changeSelection('group', getIndex(groups,selection._id));

          });
      });


      //Receive notification when a friend go online
      socket.listener('room:changeStatus', (roomId)=> {
        angular.forEach(rooms, (val)=> {
          if (val._id == roomId) {
            val.members[0].status='Online';
            return true
          }
        });
      });

      //Receive offline status
      socket.listener('userDisconnect', (roomId)=> {
        angular.forEach(rooms, (val)=> {
          console.log(val._id, rooms);
          if (val._id == roomId) {
            val.members[0].status = 'Offline';
            return true
          }
        });
      });
      //******************************************
      //Subscribe socket to all rooms(inside the server)
      //socket.joinRooms();
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


