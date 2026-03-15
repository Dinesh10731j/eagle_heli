import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("reply")
export class Reply {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ nullable: true })
  relatedTo?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
