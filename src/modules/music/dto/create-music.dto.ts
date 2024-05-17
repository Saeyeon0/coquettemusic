import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMusicDto {
  @IsOptional()
  musicFile: Express.Multer.File;

  @IsNotEmpty()
  @IsOptional()
  coauthors: null | string;

  @IsNotEmpty()
  @IsOptional()
  coauthorsEmails: null | string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
