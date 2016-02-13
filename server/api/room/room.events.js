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
  //'save': 'save',
  //'remove': 'remove'
  'tellGroup':'newGroup',
  'tellFriend': 'newRequest',
  'groupRemovedContact':'tellFriendRemoved',
  'groupExitContact':'tellFriendExit',
  'friendDeleted':'deleteFriend',
  'acceptFriend':'tellFriendAccepted',
 // 'rejectFriend':'tellFriendRejected',
  'groupDeleted':'tellGroupDeleted',
  'groupAddedContact':'tellGroupAddedFriend'
};
/*Room.schema.on("tellFriend",function(doc){
  console.log('here we are inside tell friend');
  console.log(doc.from._id);
  RoomEvents.emit("tellFriend:"+doc.from._id,doc)
});*/
// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Room.schema.on(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc,info) {
    console.log(event,doc);
    RoomEvents.emit(event, doc,info);
  }
}

export default RoomEvents;
