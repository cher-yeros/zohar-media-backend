// src/models/PaymentAmountLookup.ts
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table
export default class PaymentAmountLookup extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column(DataType.STRING)
  payment_for!: string;

  @Column(DataType.DECIMAL(10, 2))
  amount!: number;
}
