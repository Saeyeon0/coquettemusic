import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { BaseDto } from 'src/base/dto/base.dto.';

export class LoginDto extends BaseDto {
  @ApiProperty({ example: 'aliia.malaeva@alatoo.edu.kg' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6) // Минимальная длина пароля
  password: string;
}
