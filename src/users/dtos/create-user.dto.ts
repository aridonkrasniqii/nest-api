import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {

  
  id: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
