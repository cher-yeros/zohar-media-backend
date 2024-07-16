// src/models/Token.ts
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Gallery from "./gallery.model";

@Table
export default class GalleryCategory extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column(DataType.STRING)
  title!: string;

  @HasMany(() => Gallery)
  galleries!: Gallery[];
}
