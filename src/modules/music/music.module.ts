import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';
import { CategoryModule } from '../category/category.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MusicEntity]),
    UserModule,
    FileModule,
    CategoryModule,
    EmailModule,
  ],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
