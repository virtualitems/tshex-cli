import UsersService from './application/UsersService.js';

const user1 = UsersService.createUser({id: 1, email: 'user.1@example.com'});

console.log(user1.flatten());
