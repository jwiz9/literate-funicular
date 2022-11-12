const router = require('express').Router();
const { 
  getAllUsers, 
  getUserById, 
  createUser, 
  addFriend,
  updateUser,
  deleteUser,
  deleteFriend
} = require('../../controllers/user-controllers');

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:userId/:friendId')
  .post(addFriend)
  .delete(deleteFriend);

module.exports = router;