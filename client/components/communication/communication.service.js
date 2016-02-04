/*'use strict';

angular.module('chatYeoApp')
  .service('communication', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
  });*/
'use strict';

(function() {

  function CommunicationService(Room) {
    var Comm = {
      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      createRoom(room) {
        return Room.save(room,
          function(data) {
            return data;
          },
          function(err) {
            return err
          }).$promise;
      },
      createGroup(room) {
        return Room.createGroup(room,
          function(data) {
            return data;
          },
          function(err) {
            return err
          }).$promise;
      },
      deleteRoom(room) {
        return Room.delete(room,
          function(data) {
            return data;
          },
          function(err) {
            return err;
          }).$promise;
      },
      getRooms(user) {
        return Room.getRooms(user,
          function(data) {
            return data;
          },
          function(err) {
            return err;
          }).$promise;
      },
      storeMessage(room,message) {
        return Room.storeMessage(room,message,
          function(data) {
            return data;
          },
          function(err) {
            return err;
          }).$promise;
      },
      getMessage(room) {
        return Room.getMessage(room,
          function(data) {
            return data;
          },
          function(err) {
            return err;
          }).$promise;
      }

    };

    return Comm;
  }

  angular.module('chatYeoApp')
    .factory('Comm', CommunicationService);

})();
