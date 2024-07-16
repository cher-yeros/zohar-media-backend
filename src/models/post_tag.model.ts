// src/models/Token.ts
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Blog from "./blog.model";
import Tag from "./tag.model";

@Table
export default class PostTag extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @ForeignKey(() => Blog)
  blogId!: number;

  @ForeignKey(() => Tag)
  tagId!: number;
}
