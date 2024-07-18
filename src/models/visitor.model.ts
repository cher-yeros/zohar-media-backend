// src/models/Visitor.ts
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Payment from "./payment.model";
import User from "./user.model";

@Table
export default class Visitor extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column(DataType.STRING)
  first_name!: string;

  @Column(DataType.STRING)
  last_name!: string;

  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  phone!: string;

  @Column(DataType.TEXT)
  address!: string;

  @Column(DataType.TEXT)
  request_detail!: string;

  // @Column({ type: DataType.BOOLEAN })
  // include_pickup_from_airport!: boolean;

  @Column(DataType.DATE)
  date!: Date;

  @ForeignKey(() => Payment)
  payment_id!: number;

  @BelongsTo(() => Payment)
  paymnet!: Payment;
}
