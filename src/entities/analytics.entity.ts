import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("analytics")
export class Analytics {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  event!: string;

  @Column()
  path!: string;

  @Column({ nullable: true })
  referrer?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  ip?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
