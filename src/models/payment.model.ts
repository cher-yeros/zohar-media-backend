import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Partnership from "./partnership.model";
import User from "./user.model";

@Table({
  timestamps: true,
})
class Payment extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING,
    defaultValue: "Pending",
  })
  status!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tx_ref!: string;

  @ForeignKey(() => User)
  user_id!: number;

  @ForeignKey(() => Partnership)
  @Column({ allowNull: true, type: DataType.INTEGER })
  partnership_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Partnership)
  partnership!: number;
}
export default Payment;
