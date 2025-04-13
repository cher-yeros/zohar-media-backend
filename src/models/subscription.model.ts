// src/models/Token.ts
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { SubscriptionStatus } from "../enums";
import Package from "./package.model";
import Payment from "./payment.model";
import User from "./user.model";

@Table
export default class TeachingSubscription extends Model {
  @Column({ type: DataType.DATE, allowNull: true })
  start_date!: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  end_date!: Date;

  @ForeignKey(() => User)
  partner_id!: number;

  @ForeignKey(() => Package)
  package_id!: number;

  @ForeignKey(() => Payment)
  payment_id!: number;

  @BelongsTo(() => Payment)
  payment!: Payment;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Package)
  package!: Package;

  @Column({
    allowNull: false,
    defaultValue: SubscriptionStatus.PENDING,
    type: DataType.ENUM(...Object.values(SubscriptionStatus)),
  })
  role!: string;
}
