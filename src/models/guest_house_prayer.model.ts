// src/models/GuestHousePrayer.ts
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import GuestHousePrayerSchedule from "./guest_house_prayer_schedule.model";
import User from "./user.model";
import Payment from "./payment.model";

@Table
export default class GuestHousePrayer extends Model {
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
  request_detail!: string;

  @Column({ type: DataType.BOOLEAN })
  include_pickup_from_airport!: boolean;

  @Column(DataType.STRING)
  status!: string;

  @ForeignKey(() => GuestHousePrayerSchedule)
  @Column(DataType.INTEGER)
  schedule_id!: number;

  @BelongsTo(() => GuestHousePrayerSchedule)
  schedule!: GuestHousePrayerSchedule;

  @ForeignKey(() => Payment)
  payment_id!: number;

  @BelongsTo(() => Payment)
  paymnet!: Payment;
}
