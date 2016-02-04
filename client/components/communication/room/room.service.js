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
        }
      });
  }

  angular.module('chatYeoApp')
    .factory('Room', RoomResource);

})();
