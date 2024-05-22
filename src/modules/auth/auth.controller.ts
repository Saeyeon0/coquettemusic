import {
  Patch,
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/services/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { ConfirmEmailDto } from '../user/dto/cofirm-email.dto';
import { LoginDto } from '../user/dto/login-dto';
import { ForgotPasswordDto } from '../user/dto/forgot-password.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { ChangePasswordDto } from '../user/dto/change-password.dto';

@ApiTags('Регистрация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @ApiOperation({ summary: 'Регистрация' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOneUser(
      createUserDto.email,
    );
    if (existingUser && existingUser.isConfirmed) {
      throw new BadRequestException('Email already exists');
    }

    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Подтвердить email' })
  @Post('confirmEmail')
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    const existingUser = await this.userService.findOneUser(
      confirmEmailDto.email,
    );
    if (!existingUser) {
      throw new BadRequestException('Email does not exists');
    }
    const user = await this.userService.activateUser(confirmEmailDto);
    return this.authService.generateToken(user);
  }

  @ApiOperation({ summary: 'Войти в аккаунт' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findOneUser(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isConfirmed) {
      throw new BadRequestException('Account is not activated');
    }
    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.generateToken(user);
  }


}
