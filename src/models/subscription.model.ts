// src/models/Token.ts
import {
  BelongsTo,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import Package from "./package.model";
import Payment from "./payment.model";
import User from "./user.model";

@Table
export default class Subscription extends Model {
  @ForeignKey(() => User)
  partner_id!: number;

  @ForeignKey(() => Package)
  package_id!: number;

  @ForeignKey(() => Payment)
  payment_id!: number;

  @BelongsTo(() => Payment)
  payment!: Payment;
}
