import {
  Body,
  Post,
  Req,
  Controller,
  UseInterceptors,
  UseGuards,
  Get,
  Param,
  BadRequestException,
  UploadedFile,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MusicService } from './music.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMusicDto } from './dto/create-music.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import * as pdfParse from 'pdf-parse';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @ApiTags('Musics for user')
  @Get('allMy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить мою музыку' })
  async getAllMyMusics(@Req() req: any) {
    return await this.musicService.getAllMy(req.user.id);
  }

  @ApiTags('Musics for user')
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create music' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('musicFile'))
  async createMusic(
    @Req() req: any,
    @Body()
    createMusicDto: CreateMusicDto,
    @UploadedFile()
    musicFile: Express.Multer.File,
  ) {
    const music = new CreateMusicDto();

    if (!musicFile) {
      throw new BadRequestException('File not found');
    }
    music.musicFile = musicFile;
    Object.assign(music, createMusicDto);
    return await this.musicService.createMusic(req.user.id, music);
  }

  @ApiTags('Musics for user')
  @Post('add/toFavorites/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить музыку в избранное' })
  async addToFavorites(@Req() req: any, @Param('id') id: number) {
    return await this.musicService.addToFavotites(req.user.id, id);
  }

  @ApiTags('Musics for user')
  @Get('favorites/getAll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить список избранных' })
  async getFavorites(@Req() req: any) {
    return await this.musicService.getFavorites(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiTags('Admin')
  @Get('all/notApproved')
  @ApiOperation({ summary: 'Get all not approved musics' })
  async getMusics(@Req() req) {
    await this.musicService.checkAdmin(req.user.role);
    return await this.musicService.getAll();
  }

  @ApiTags('Music')
  @Get('get/approved')
  @ApiOperation({ summary: 'Get all approved musics' })
  async getAllApproved() {
    return await this.musicService.getAllApproved();
  }

  @ApiTags('Music')
  @Get('category/:categoryName')
  @ApiOperation({ summary: 'Get musics of a certain category' })
  async getCategoryMusics(@Param('categoryName') name: string) {
    return await this.musicService.getAllByCategory(name);
  }

  @ApiTags('Music')
  @Get('find/:id')
  @ApiOperation({ summary: 'Get music by id' })
  async getMusic(@Param('id') id: number) {
    return await this.musicService.getOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiTags('Admin')
  @Get('all/deleted') // Updated route to avoid conflict
  @ApiOperation({ summary: 'Get all deleted musics' })
  async getDeletedMusics(@Req() req) {
    await this.musicService.checkAdmin(req.user.role);
    return await this.musicService.getAllDeleted();
  }

  @ApiTags('Admin')
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete music by id' })
  async deleteMusic(@Param('id') id: number, @Req() req) {
    await this.musicService.checkAdmin(req.user.role);
    return await this.musicService.deleteMusic(+id);
  }
  @ApiTags('Admin')
  @Patch('approve/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve music by id' })
  async approveMusic(@Param('id') id: number, @Req() req) {
    await this.musicService.checkAdmin(req.user.role);
    return await this.musicService.approveMusic(+id);
  }

  @ApiTags('Admin')
  @Patch('decline/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decline music by id' })
  async declineMusic(@Param('id') id: number, @Req() req) {
    await this.musicService.checkAdmin(req.user.role);
    return await this.musicService.declineMusic(+id);
  }
}
