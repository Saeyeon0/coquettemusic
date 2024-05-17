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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить данные профиля' })
  @Get('get/profile')
  async getProfile(@Req() req) {
    return await this.userService.get(+req.user.id);
  }

  @ApiOperation({ summary: 'Найти пользователя по id' })
  @Get(':id')
  async getById(@Param('id') id: number) {
    return await this.userService.get(id);
  }

  @ApiOperation({ summary: 'Удалить пользователя' })
  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
