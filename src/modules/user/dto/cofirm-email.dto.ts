import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({ example: 'aliia.malaeva@alatoo.edu.kg' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(6) // Минимальная длина пароля
  code: string;
}
