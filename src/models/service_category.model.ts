// src/models/Token.ts
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Service from "./service.model";

@Table
export default class ServiceCategory extends Model {
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
  playlist_link!: string;

  @HasMany(() => Service)
  services!: Service[];
}
