const router = require('express').Router()
const {User} = require('../db/models')

module.exports = router;

router.get('/', function(req,res,next){
  if(req.user.isAdmin){
    User.FindAll({
      attributes: { exclude: ['password', "id"]}
    })
    .then(users =>res.json(users))
    .catch(next);
  }
  res.sendMessage('YOU DO NOT BELONG')
});

router.get('/friends', function(req,res,next){
  User.findById(req.user.id)
  .then(user => user.getFriends())
  .then(friends => res.json(friends))
  .catch(next);
})

router.post('/add/:friendId', function(req,res,next){
  User.findById(req.user.id)
  .then(user => user.addFriends(req.params.friendId))
  .then(newFriend => res.json(newFriend))
  .catch(next);
})