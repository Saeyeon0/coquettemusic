import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получить список всех пользователей' })
  @Get()
  async getAll() {
    return await this.userService.getAllUsers();
  }

}
