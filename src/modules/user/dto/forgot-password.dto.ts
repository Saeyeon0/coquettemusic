import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'aliia.malaeva@alatoo.edu.kg' })
  @IsEmail()
  email: string;
}
