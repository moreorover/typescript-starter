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

  @Column("double")
  price: number;

  @Column("double")
  delta: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Item, (item) => item.prices)
  item: Item;
}
