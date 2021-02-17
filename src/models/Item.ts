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

  @Column("double")
  price: number;

  @Column("double")
  delta: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Price, (price) => price.item)
  prices: Price[];

  static findByUpc(upc: string) {
    return this.createQueryBuilder("item")
      .where("item.upc = :upc", {
        upc: upc,
      })
      .getOne();
  }
}
