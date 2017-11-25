const db = require('./server/db');
const User = require('./server/db/models/user');



const users = [
  {email: "Jose@Sabal.com",
    password: "jose",
    "isAdmin": true },
    {email: "Nick@Plucker.com",
    password: "nick",
    "isAdmin": true },
    {email: "Mitchell@Drury.com",
    password: "mitchell",
    "isAdmin": true },
    {email: "Anthony@Clausing.com",
    password: "anthony",
    "isAdmin": true },
    {email: "Firet@Test.com",
    password: "first"},
    {email: "John@Doe.com",
    password: "john"},
    {email: "Jane@Doe.com",
    password: "jane"},
    {email: "HackerMan@hacks.com",
    password: 'abc123'}
]


const seed = () =>
  Promise.all(users.map( user =>
    User.create(user))
  )

const main = () => {
  console.log('Syncing db...');
  db.sync()
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