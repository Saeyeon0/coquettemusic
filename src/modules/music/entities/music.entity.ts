import { BaseEntity } from 'src/base/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class MusicEntity extends BaseEntity {
  @Column({ nullable: true })
  fileUrl: null | string;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(() => UserEntity, (user) => user.musics, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.favorites, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  lover: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.music)
  category: CategoryEntity;
}
