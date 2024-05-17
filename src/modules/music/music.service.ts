import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { MusicEntity } from './entities/music.entity';
import { Repository } from 'typeorm';
import { CreateMusicDto } from './dto/create-music.dto';
import { UserService } from '../user/services/user.service';
import { FileService } from '../file/file.service';
import { CategoryService } from '../category/category.service';
import { EmailService } from '../email/email.service';
import { log } from 'console';
import { UserRole } from '../user/enums/roles.enum';

@Injectable()
export class MusicService extends BaseService<MusicEntity> {
  constructor(
    @InjectRepository(MusicEntity)
    private readonly musicRepository: Repository<MusicEntity>,
    private userService: UserService,
    private categoryService: CategoryService,
    private fileService: FileService,
    private emailService: EmailService,
  ) {
    super(musicRepository);
  }

  async saveMusic(music: MusicEntity) {
    return await this.musicRepository.save(music);
  }

  async getAllDeleted() {
    return await this.musicRepository.find({
      where: { isDeleted: true },
      relations: ['category'],
    });
  }

  async getAll() {
    const musics = await this.musicRepository.find({
      relations: ['category', 'user'],
      where: { isDeleted: false, isApproved: false },
    });

    for (let i = 0; i < musics.length; i++) {
      if (musics[i].user) {
        delete musics[i].user.password;
        delete musics[i].user.confirmCodeId;
        delete musics[i].user.passwordRecoveryCodeId;
      }
    }
    return musics;
  }

  async addToFavotites(userId, id) {
    const music = await this.getOne(id);
    const user = await this.userService.findById(userId);
    user.favorites.push(music);
    await this.userService.saveUser(user);
    return { status: 'Success' };
  }

  async getFavorites(userId) {
    const user = await this.userService.findById(userId);
    return user.favorites;
  }

  async createMusic(userId: number, createMusicDto: CreateMusicDto) {
    const category = await this.categoryService.findOne(
      createMusicDto.category,
    );
    const music = new MusicEntity();
    if (createMusicDto.musicFile) {
      const musicFile = await this.fileService.createPdf(
        createMusicDto.musicFile,
      );
      music.fileUrl = musicFile.url;
    }

    Object.assign(music, createMusicDto);
    music.category = category;
    const user = await this.userService.findById(userId);
    user.musics.push(music);
    await this.userService.saveUser(user);
    console.log(music);
    await this.musicRepository.save(music);
    return { message: 'Successfully created music' };
  }
  async getOne(id: number) {
    const music = await this.musicRepository.findOne({
      where: { id: id, isApproved: true, isDeleted: false },
      relations: ['category'],
    });
    await this.checkIfExcist(music, 'music', id);
    if (music.user) {
      delete music.user.password;
      delete music.user.confirmCodeId;
      delete music.user.passwordRecoveryCodeId;
    }
    return music;
  }

  async getAllByCategory(name: string) {
    await this.categoryService.findOne(name);
    return await this.musicRepository.find({
      where: { category: { name: name } },
      relations: ['category'],
    });
  }

  async getAllMy(id: number) {
    const musics = await this.musicRepository.find({
      where: { user: { id: id }, isDeleted: false },
      relations: ['user', 'category'],
    });
    for (let i = 0; i < musics.length; i++) {
      delete musics[i].user;
    }
    return musics;
  }

  async getAllMyDeleted(id: number) {
    const musics = await this.musicRepository.find({
      where: { user: { id: id }, isDeleted: true },
      relations: ['user', 'category'],
    });
    for (let i = 0; i < musics.length; i++) {
      delete musics[i].user;
    }
    return musics;
  }
  async deleteMusic(id: number) {
    const music = await this.getOne(id);
    if (music && !music.isDeleted) {
      music.isDeleted = true;
      music.isApproved = false;
      await this.musicRepository.save(music);
      return { message: 'Successfully deleted' };
    }
    return;
  }

  async restoreMusic(id: number) {
    const music = await this.getOne(id);
    if (music && music.isDeleted) {
      music.isDeleted = false;
      await this.musicRepository.save(music);
      return { message: 'Successfully restored' };
    }
    return;
  }

  async approveMusic(id: number) {
    const music = await this.getOne(id);
    if (music.isDeleted) {
      throw new BadRequestException('Incorrect status of music');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: music.user.email,
      subject: 'Music approving',
      text: `Hello! Your payment reciept for music "${music.title}" was approved and music was published!
Здравствуйте! Ваш чек об оплате за статью "${music.title}"  был принят а статья была опубликована!`,
    };
    const sentEmail = await this.emailService.sendMail(mailOptions);
    if (!sentEmail) {
      throw new BadRequestException('Email sending error');
    }
    music.isApproved = true;
    await this.musicRepository.save(music);
    return { message: 'Successfully approved' };
  }

  async declineMusic(id: number) {
    const music = await this.getOne(id);
    if (music.isDeleted) {
      throw new BadRequestException('Incorrect status of music');
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: music.user.email,
      subject: 'Music approving',
      text: `Hello! Unfortunately Your music "${music.title}" was not approved to payment, contact to admin on comments below music!
Здравствуйте! К сожалению Ваша статья "${music.title}" не  была одобрена к оплате, свяжитесь с администратором в комментариях под статьей!`,
    };
    const sentEmail = await this.emailService.sendMail(mailOptions);
    if (!sentEmail) {
      throw new BadRequestException('Email sending error');
    }
    music.isApproved = false;
    music.isDeleted = true;
    await this.musicRepository.save(music);
    // music has mistakes
    return { message: 'Successfully declined' };
  }

  async getAllApproved() {
    return await this.musicRepository.find({
      where: { isApproved: true, isDeleted: false },
    });
  }

  async checkAdmin(userRole: UserRole) {
    if (userRole !== UserRole.ADMIN) {
      throw new BadRequestException('Only admin has permission to this');
    }
  }
}
