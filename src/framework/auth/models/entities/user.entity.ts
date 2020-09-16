import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import * as bycrypt from 'bcryptjs';

@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  async validatePassword(password: string): Promise<boolean> {
    return await bycrypt.compare(password, this.password);
  }
}
