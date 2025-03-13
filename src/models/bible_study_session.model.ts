// src/models/BibleStudy.ts
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import User from "./user.model";

@Table
export default class BibleStudySession extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.DATE)
  date!: Date;

  @Column(DataType.DATE)
  start_time!: Date;

  @Column(DataType.DATE)
  end_time!: Date;

  @Column(DataType.STRING)
  zoom_id!: string;

  @Column(DataType.STRING)
  zoom_link!: string;

  @Column(DataType.STRING)
  zoom_passcode!: string;

  @Column(DataType.DOUBLE)
  payment_amount_usd!: number;

  @Column(DataType.DOUBLE)
  payment_amount_etb!: number;

  @Column({ type: DataType.STRING, defaultValue: "CREATED" })
  status!: string;

  @Column(DataType.STRING)
  picture!: string;
}
