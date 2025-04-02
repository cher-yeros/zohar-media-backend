// src/models/Token.ts
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { TeachingType } from "../enums";
import TeachingCategory from "./teaching_category.model";

@Table
export default class Teaching extends Model {
  @Column(DataType.STRING)
  picture!: string;

  @Column(DataType.STRING)
  trailer!: string;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  owner!: string;

  @Column(DataType.STRING)
  description!: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(TeachingType)),
  })
  content_type!: string;

  @Column(DataType.STRING)
  file_url!: string;

  @Column(DataType.STRING)
  seo_tags!: string;

  @Column(DataType.BOOLEAN)
  is_downloadable!: boolean;

  @Column(DataType.BOOLEAN)
  active!: boolean;

  @ForeignKey(() => TeachingCategory)
  category_id!: number;

  @BelongsTo(() => TeachingCategory)
  category!: TeachingCategory;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price_etb!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price_usd!: number;
}
