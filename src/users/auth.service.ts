import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async singup(email: string, password: string) {
    // See if email is in use
    const userExist = await this.usersService.find(email);
    if (userExist.length) throw new BadRequestException('Email is already taken');

    /**
     The random bites we're putting in a number right here, this function is going to return back to us a buffer, which is similar to an array. The difference is that a buffer holds some raw data inside of it. Binary like ones and zeros, we don't wanna work with bits, we want to work with a string of random numbers and letters.
     The eight right here means that our buffer is goind to have eight bytes worth of data inside of it, every one bit of data turns into two characters when we convert it to hex. So our salt is going to be a 16 character long string.  
     */
    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer; // 32 means just give us back thirty two.
    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.usersService.create(email, result);

    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
