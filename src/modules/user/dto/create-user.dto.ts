import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseDto } from 'src/base/dto/base.dto.';

export class CreateUserDto extends BaseDto {
  @ApiProperty({ example: 'SemEn' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Malaeva' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'aliia.malaeva@alatoo.edu.kg' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MaxLength(25)
  @MinLength(6) // Минимальная длина пароля
  password: string;
}
