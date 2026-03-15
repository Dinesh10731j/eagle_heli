import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("seo_meta_data")
export class SeoMetaData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  page!: string;

  @Column()
  metaTitle!: string;

  @Column({ type: "text" })
  metaDescription!: string;

  @Column({ type: "text", nullable: true })
  metaKeywords?: string;

  @Column({ nullable: true })
  ogTitle?: string;

  @Column({ type: "text", nullable: true })
  ogDescription?: string;

  @Column({ nullable: true })
  ogImage?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
