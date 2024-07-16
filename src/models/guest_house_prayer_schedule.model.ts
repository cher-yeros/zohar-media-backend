// src/models/Schedule.ts
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import GuestHousePrayer from "./guest_house_prayer.model";

@Table
export default class GuestHousePrayerSchedule extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column(DataType.DATE)
  date!: Date;

  @Column(DataType.DATE)
  start_time!: Date;

  @Column(DataType.DATE)
  end_time!: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  availabile!: boolean;

  @Column({ type: DataType.STRING, defaultValue: "OPEN" })
  status!: string;

  @Column(DataType.DOUBLE)
  payment_amount_usd!: number;

  @Column(DataType.DOUBLE)
  payment_amount_etb!: number;

  @Column(DataType.DOUBLE)
  pickup_extra_payment_usd!: number;

  @Column(DataType.DOUBLE)
  pickup_extra_payment_etb!: number;

  @HasMany(() => GuestHousePrayer)
  guest_house_prayers!: GuestHousePrayer[];
}
