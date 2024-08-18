import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

enum TOKEN_TYPE {
  access = 'access',
  refresh = 'refresh',
}

export class JwtDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  google_id: string;
}
