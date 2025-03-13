// src/models/Token.ts
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Blog from "./blog.model";
import ServiceCategory from "./service_category.model";

@Table
export default class Service extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  // @Column(DataType.STRING)
  // service_day!: string;

  // @Column(DataType.DATE)
  // service_date!: Date;

  @Column(DataType.STRING)
  youtube_link!: string;

  @ForeignKey(() => ServiceCategory)
  service_category_id!: number;

  @BelongsTo(() => ServiceCategory)
  category!: ServiceCategory[];
}
