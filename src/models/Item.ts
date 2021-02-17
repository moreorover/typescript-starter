import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Price } from "./Price";

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  upc: string;

  @Column()
  imageUrl: string;

  @Column()
  url: string;

  @Column()
  whereFound: string;

  @Column()
  price: number;

  @Column()
  delta: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Price, (price) => price.item)
  prices: Price[];
}
