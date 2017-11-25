const router = require('express').Router()
const User = require('../db/models/user')

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