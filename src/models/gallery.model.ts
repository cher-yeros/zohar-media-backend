// src/models/Token.ts
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import GalleryCategory from "./gallery_category.model";

@Table
export default class Gallery extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  city!: string;

  @Column(DataType.JSON)
  images!: object;

  @ForeignKey(() => GalleryCategory)
  gallery_category_id!: number;

  @BelongsTo(() => GalleryCategory)
  category!: GalleryCategory[];
}
