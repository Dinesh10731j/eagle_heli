import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("team")
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  role?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  profileImage!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
