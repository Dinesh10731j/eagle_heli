import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("seo")
export class Seo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  page!: string;

  @Column()
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "text", nullable: true })
  keywords?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
