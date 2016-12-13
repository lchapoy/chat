/* global io */
'use strict';
angular.module('chatYeoApp')
  .factory('socket', function(socketFactory,Auth,$mdToast,$state) {
    // socket.io now auto-configures its connection when we ommit a connection url
    var user=Auth.getCurrentUser();
    var socketInstance=true;
    var ioSocket;
    var socket;
    function showSimpleToast(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('right bottom')
          .hideDelay(3000)
      );
    }
    var createSocket=()=>{
      if(socketInstance) {
        ioSocket = io('', {
          // Send auth token on connection, you will need to DI the Auth service above
          'query': 'token=' + Auth.getToken(),
          'force new connection': true,
          path: '/socket.io-client'
        });
        socket = socketFactory({ioSocket});
        socketInstance=false;
      }
      socket.on('forceDisconnect', function () {
        socket.disconnect();
        socketInstance=true;
        $state.go('logout',{force:true})
      });

      return socket;
    };
    socket=createSocket();

      return {
        socket:createSocket,

        /**
         * Register listeners to sync an array with updates on a model
         *
         * Takes the array we want to sync, the model name that socket updates are sent from,
         * and an optional callback function after new items are updated.
         *
         * @param {String} modelName
         * @param {Array} array
         * @param {Function} cb
         */
          syncUpdates(modelName, array, cb) {
          cb = cb || angular.noop;

          /**
           * Syncs item creation/updates on 'model:save'
           */
          socket.on(modelName + ':save', function (item) {
            var oldItem = _.find(array, {_id: item._id});
            var index = array.indexOf(oldItem);
            var event = 'created';

            // replace oldItem if it exists
            // otherwise just add item to the collection
            if (oldItem) {
              array.splice(index, 1, item);
              event = 'updated';
            } else {
              array.push(item);
            }

            cb(event, item, array);
          });


          /**
           * Syncs removed items on 'model:remove'
           */
          socket.on(modelName + ':remove', function (item) {
            var event = 'deleted';
            _.remove(array, {_id: item._id});
            cb(event, item, array);
          });
        },

        /**
         * Removes listeners for a models updates on the socket
         *
         * @param modelName
         */
          unsyncUpdates(modelName) {
          socket.removeAllListeners(modelName + ':save');
          socket.removeAllListeners(modelName + ':remove');
        },
        emitter(event,doc){
          socket.emit(event,doc)
        },
        listener(event,cb){
          cb = cb || angular.noop;
          socket.on(event,(doc,message)=>{
            console.log(message);
         //   if(message&&user._id!=doc.friendId)
            showSimpleToast(message);
            cb(doc);
          })
        },
        joinRooms(){
          socket.emit('room:joinRooms')
        },
       addRoom(roomId){
          socket.emit('room:addRoom',roomId)
        },
        removeRoom(roomId){
          socket.emit('room:removeRoom',roomId)
        },
        messageToRoom(roomId,message,kind){
          socket.emit('room:newMessage',{roomId:roomId,message:message,kind:kind})
        },
        disconnect(){
          socket.emit('forceDisconnect');
          socket.disconnect();
          socketInstance=true;
        }
      };

  });
