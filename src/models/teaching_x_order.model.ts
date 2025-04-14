// src/models/Token.ts
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Teaching from "./teaching.model";
import Order from "./teaching_order.model";

@Table
export default class TeachingXOrder extends Model {
  @ForeignKey(() => Teaching)
  teaching_id!: number;

  @ForeignKey(() => Order)
  order_id!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  total!: number;

  //   @BelongsTo(() => Teaching)
  //   teaching!: Teaching;

  //   @BelongsTo(() => Order)
  //   order!: Order;
}
