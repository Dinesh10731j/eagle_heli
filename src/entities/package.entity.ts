import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("package")
export class Package {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column({ type: "int", default: 1 })
  durationDays!: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
