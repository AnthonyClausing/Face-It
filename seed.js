const db = require('./server/db');
const {User} = require('./server/db/models');
//const Friends = require('./server/db/models/friends');



const users = [
  {
    email: "Jose@Sabal.com",
    userName: 'NoWayJose',
    password: "jose",
    "isAdmin": true 
  },
  {
    email: "Nick@Plucker.com",
    userName: "NotNicholasNick",
    password: "nick",
    "isAdmin": true 
  },
  {
    email: "Mitchell@Drury.com",
    userName: "MusicalMitchell",
    password: "mitchell",
    "isAdmin": true 
  },
  {
    email: "Anthony@Clausing.com",
    userName: "AnxiousAnthony",
    password: "anthony",
    "isAdmin": true 
  },
  {
    email: "First@Test.com",
    userName: "TestBoy",
    password: "first"
  },
  {
    email: "John@Doe.com",
    userName: "JohnDoe",
    password: "john"
  },
  {
    email: "Jane@Doe.com",
    userName: "JaneDoe",
    password: "jane"
  },
  {
    email: "HackerMan@hacks.com",
    userName: "HackerMan",
    password: 'abc123'
  }
]




const seed = () =>
  Promise.all(users.map( user =>
    User.create(user))
  )
  //How to test the Magical sequelize function addFriends and getFriends(using the Friends through table)
  // .then(users => {
  //   users[1].addFriends(users[2])
  //  return users[1].addFriends(users[3])
  // })
  // .then(() => User.findById(2))
  // .then(user => user.getFriends())
  // .then(friends => console.log(friends))

const main = () => {
  console.log('Syncing db...');
  db.sync({force:true})
    .then(() => {
      console.log('Seeding database...............');
      return seed();
    })
    .catch(err => {
      console.log('Error while seeding');
      console.log(err.stack);
    })
    .then(() => {
      db.close();
      return null;
    });
};

main();