// src/models/Token.ts
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { OrderStatus } from "../enums";
import Payment from "./payment.model";
import Teaching from "./teaching.model";
import TeachingXOrder from "./teaching_x_order.model";
import User from "./user.model";

@Table
export default class Order extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    defaultValue: () => uuidv4(),
  })
  order_no!: string;

  @Column({
    allowNull: false,
  })
  first_name!: string;

  @Column({
    allowNull: false,
  })
  last_name!: string;

  @Column({ type: DataType.VIRTUAL })
  get full_name() {
    return `${this.getDataValue("firstname")} ${this.getDataValue("lastname")}`;
  }

  @Column({
    allowNull: true,
  })
  phone?: string;

  @Column({
    allowNull: false,
  })
  email!: string;

  @Column(DataType.STRING)
  payment_method!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  sub_total!: number;

  @Column({
    allowNull: false,
    defaultValue: OrderStatus.PENDING,
    type: DataType.ENUM(...Object.values(OrderStatus)),
  })
  status!: string;

  @ForeignKey(() => Payment)
  @Column
  payemnt_id!: number;

  @BelongsTo(() => Payment)
  payemnt!: Payment;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsToMany(() => Teaching, () => TeachingXOrder)
  teachings!: Teaching[];
}
