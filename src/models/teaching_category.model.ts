// src/models/Token.ts
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table
export default class TeachingCategory extends Model {
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  picture!: string;

  @Column(DataType.JSON)
  description!: object;
}
