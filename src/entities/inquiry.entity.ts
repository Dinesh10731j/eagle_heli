import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("inquiry")
export class Inquiry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  service?: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
