import UsersService from './application/UsersService.js';

const user1 = UsersService.create(1);
const user2 = UsersService.create(2);

console.log(user1.equals(user2));

console.log(user1.flatten());
