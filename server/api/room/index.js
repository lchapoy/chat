'use strict';

import {Router} from 'express';
import * as controller from './room.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', controller.index);
//router.get('/:id', controller.show);
router.get('/:id/getRooms', controller.getRooms);
router.get('/:id/getRequestPendings', controller.getRequestPendings);
router.get('/:id/getMessage', controller.getMessage);
router.post('/', controller.createRoom);
router.post('/createGroup', controller.createGroup);
router.post('/deleteFriendFromGroup', controller.deleteFriendFromGroup);
router.post('/addFriendToGroup', controller.addFriendToGroup);
router.post('/deleteGroup', controller.deleteGroup);
router.post('/exitGroup', controller.exitGroup);
router.post('/acceptFriend', controller.acceptFriend);
router.post('/rejectFriend', controller.rejectFriend);
router.put('/:id/storeMessage', controller.storeMessage);
router.delete('/:id', controller.destroy);

module.exports = router;
