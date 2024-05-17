import { BaseEntity } from 'src/base/base.entity';
import { MusicEntity } from 'src/modules/music/entities/music.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class CategoryEntity extends BaseEntity {
  @Column({
    unique: true,
    nullable: true,
  })
  name: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => MusicEntity, (music) => music.category)
  music: MusicEntity[];
}
