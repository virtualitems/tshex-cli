import UsersService from './application/UsersService.js';

const user1 = UsersService.createUser(1);
user1.email = 'user.1@example.com';

console.log(user1.flatten());
