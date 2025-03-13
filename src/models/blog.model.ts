// src/models/Token.ts
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import User from "./user.model";
import Category from "./category.model";

@Table
export default class Blog extends Model {
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
  slug!: string;

  @Column(DataType.STRING)
  excerpt!: string;

  @Column(DataType.TEXT)
  body!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  featured!: boolean;

  @Column(DataType.STRING)
  image!: boolean;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Category)
  category!: Category;

  @ForeignKey(() => Category)
  categoryId!: number;
}
