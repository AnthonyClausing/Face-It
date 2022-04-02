const db = require('./server/db');
const {User, Game} = require('./server/db/models');
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

const games = [
  {
    winner: "NoWayJose",
    player1Score: 50,
    player2Score: 45
  },
  {
    winner: "NoWayJose",
    player1Score: 20,
    player2Score: 10
  },
  {
    winner: "AnxiousAnthony",
    player1Score: 33,
    player2Score: 32
  },
  {
    winner: "NotNicholasNick",
    player1Score: 24,
    player2Score: 20
  },
  {
    winner: "MusicalMitchell",
    player1Score: 50,
    player2Score: 45

  }]




  const seed = () =>
    Promise.all( users.map( user =>{ 
      return User.create(user)
    }))
    .then(() =>
    Promise.all(games.map(game=> {
       return Game.create(game)
    })))
    .catch( err => console.log(err))
  //How to test the Magical sequelize function addFriends and getFriends(using the Friends through table)
  // .then(users => {
  //   users[1].addFriends(users[2])
  //  return users[1].addFriends(users[3])
  // })
  // .then(() => User.findByPk(2))
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