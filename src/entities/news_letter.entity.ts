import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("news_letter")
export class NewsLetter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
