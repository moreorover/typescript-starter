import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Store } from "./Store";

@Entity()
export class Url extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Store, (store) => store.urls)
  store: Store;

  static findByLikeUrl(
    urlLike: string,
    timeInThePast: Date
  ): Promise<Url | undefined> {
    return this.createQueryBuilder("url")
      .where("url.updatedAt < :time AND url.url like :url", {
        time: timeInThePast,
        url: `%${urlLike}%`,
      })
      .orderBy("url.updatedAt", "ASC")
      .getOne();
  }

  static findManyByLikeUrl(urlLike: string, timeInThePast: Date) {
    return this.createQueryBuilder("url")
      .where("url.updatedAt < :time AND url.url like :url", {
        time: timeInThePast,
        url: `%${urlLike}%`,
      })
      .orderBy("url.updatedAt", "ASC")
      .getMany();
  }
}
