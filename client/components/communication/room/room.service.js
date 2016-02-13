'use strict';

(function() {

  function RoomResource($resource) {
    return $resource('/api/rooms/:id/:controller', {
      id: '@_id'
    },
      {
        getRooms: {
          method: 'GET',
          params: {
            controller:'getRooms'
          },
          isArray:true
        },
        getRequestPendings: {
          method: 'GET',
          params: {
            controller:'getRequestPendings'
          }
        },
        createGroup: {
          method: 'POST',
          params: {
            controller:'createGroup'
          }
        },
        storeMessage: {
          method: 'PUT',
          params: {
            controller:'storeMessage'
          },
          isArray:true
        },
        getMessage: {
          method: 'GET',
          params: {
            controller:'getMessage'
          },
          isArray:true
        },
        deleteFriendFromGroup: {
          method: 'POST',
          params: {
            controller:'deleteFriendFromGroup'
          }
        },
        addFriendToGroup: {
          method: 'POST',
          params: {
            controller:'addFriendToGroup'
          }
        },
        deleteGroup: {
          method: 'POST',
          params: {
            controller:'deleteGroup'
          }
        },
        exitGroup: {
          method: 'POST',
          params: {
            controller:'exitGroup'
          }
        },
        acceptFriend: {
          method: 'POST',
          params: {
            controller:'acceptFriend'
          }
        },
        rejectFriend: {
          method: 'POST',
          params: {
            controller:'rejectFriend'
          }
        }

      });
  }

  angular.module('chatYeoApp')
    .factory('Room', RoomResource);

})();
