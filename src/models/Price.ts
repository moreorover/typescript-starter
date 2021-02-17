import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";
import { Item } from "./Item";

@Entity()
export class Price extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  delta: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Item, (item) => item.prices)
  item: Item;
}
