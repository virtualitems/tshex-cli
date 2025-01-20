import UsersService from './application/UsersService.js';

const user1 = UsersService.createUser(1);
const user2 = UsersService.createUser(2);

console.log(user1.equals(user2));

console.log(user1.flatten());
