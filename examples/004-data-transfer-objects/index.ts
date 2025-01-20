import CreateUserDTO from './application/CreateUserDTO.js';
import UsersService from './application/UsersService.js';

const userdto = new CreateUserDTO(1,'user.1@example.com');

const user1 = UsersService.createUser(userdto);

console.log(user1.flatten());
