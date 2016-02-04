'use strict';

(function() {

function UserResource($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller:'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id:'me'
      }
    },
    getFriends: {
      method: 'GET',
      params: {
        controller:'getAllFriends'
      },
      isArray:true
    },
    addFriend: {
      method: 'PUT',
      params: {
        controller:'addMail'
      }
    },
    addContactRoom: {
      method: 'PUT',
      params: {
        controller: 'addContRoom'
      }
    },
    addGroup: {
      method: 'PUT',
      params: {
        controller: 'addGroup'
      }
    }

  });
}

angular.module('chatYeoApp.auth')
  .factory('User', UserResource);

})();
