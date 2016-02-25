/**
 * Room model events
 */

'use strict';

import {EventEmitter} from 'events';
var Room = require('./room.model');
var RoomEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RoomEvents.setMaxListeners(0);

// Model events
var events = {
  'tellGroup':'newGroup',
  'tellFriend': 'newRequest',
  'groupRemovedContact':'tellFriendRemoved',
  'groupExitContact':'tellFriendExit',
  'friendDeleted':'deleteFriend',
  'acceptFriend':'tellFriendAccepted',
  'joinRooms':'joinRooms',
 // 'rejectFriend':'tellFriendRejected', //This behavior was deleted
  'groupDeleted':'tellGroupDeleted',
  'groupAddedContact':'tellGroupAddedFriend'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Room.schema.on(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc,info) {
    RoomEvents.emit(event, doc,info);
  }
}

export default RoomEvents;
