'use strict';

import {Router} from 'express';
import * as controller from './room.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.isAuthenticated(),  controller.index);
router.get('/:id/getRooms', auth.isAuthenticated(),  controller.getRooms);
router.get('/:id/getRequestPendings', auth.isAuthenticated(),  controller.getRequestPendings);
router.get('/:id/getMessage', auth.isAuthenticated(),  controller.getMessage);
router.post('/', auth.isAuthenticated(),  controller.friendRequest);
router.post('/createGroup', auth.isAuthenticated(),  controller.createGroup);
router.post('/deleteFriendFromGroup', auth.isAuthenticated(),  controller.deleteFriendFromGroup);
router.post('/addFriendToGroup', auth.isAuthenticated(),  controller.addFriendToGroup);
router.post('/deleteGroup', auth.isAuthenticated(),  controller.deleteGroup);
router.post('/exitGroup', auth.isAuthenticated(),  controller.exitGroup);
router.post('/acceptFriend', auth.isAuthenticated(),  controller.acceptFriend);
router.post('/rejectFriend', auth.isAuthenticated(),  controller.rejectFriend);
router.put('/:id/storeMessage', auth.isAuthenticated(),  controller.storeMessage);
router.delete('/:id', auth.isAuthenticated(),  controller.destroy);

module.exports = router;
