const router = require('express').Router()
const {User,Game} = require('../db/models')

module.exports = router;

router.get('/', function(req,res,next){
  if(req.user.isAdmin){
    User.findAll({
      attributes: { exclude: ['password', "id", "salt"]}
    })
    .then(users =>res.json(users))
    .catch(next);
  }else{
    res.send('YOU DO NOT BELONG')
  }
});


router.get('/friends', function(req,res,next){
  if(req.user){
  User.findById(req.user.id)
  .then(user => user.getFriends())
  .then(friends => res.json(friends))
  .catch(next);
  }
})
router.get('/games', function(req,res,next){
  if(req.user){
    User.findById(req.user.id)
    .then(user => user.getGames())
    .then(games => res.json(games))
    .catch(next);
  }
})

router.post('/addFriend', function(req,res,next){
  Promise.all([User.findById(req.user.id),User.findOne({ where:{ userName: req.body.friendName }})])
   .then(users => {
     let friender = users.find(user => user.id === req.user.id)
     let friendee = users.find(user => user.id !== req.user.id)
     return friender.addFriends(friendee)
    })
     .then(newfriend =>  res.json(newfriend))
     .catch(next)
})

router.delete('/friends/:id', function(req,res,next){
  User.findById(req.user.id)
  .then(user => user.removeFriends(req.params.id))
  .catch(next);
})


