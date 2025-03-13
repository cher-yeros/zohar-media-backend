// src/models/Token.ts
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Blog from "./blog.model";

@Table
export default class Category extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column(DataType.STRING)
  title!: string;

  @HasMany(() => Blog)
  blogs!: Blog[];
}
