import UsersService from '../application/UsersService.js';


export function example()
{
    const user1 = UsersService.createUser(1);
    console.log('created user1:', user1);
    console.log('user1 raw data:', user1.flatten());

    const user2 = UsersService.createUser(2);
    console.log('created user2:', user2);
    console.log('user2 raw data:', user2.flatten());

    const eq = user1.equals(user2);
    console.log('user1 equals user2:', eq);
}
