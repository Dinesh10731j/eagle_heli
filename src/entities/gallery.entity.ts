import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("gallery")
export class Gallery {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  image!: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: "timestamp", nullable: true })
  date?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
