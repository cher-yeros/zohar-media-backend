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
    allowNull: false,
  })
  first_name!: string;

  @Column({
    allowNull: false,
  })
  last_name!: string;

  @Column({ type: DataType.VIRTUAL })
  get full_name() {
    return `${this.getDataValue("first_name")} ${this.getDataValue(
      "last_name"
    )}`;
  }

  @Column(DataType.STRING)
  phone!: string;

  @Column({
    allowNull: false,
    unique: false,
  })
  email!: string;

  @Column(DataType.STRING)
  payment_method!: string;

  @Column(DataType.STRING)
  reason!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING,
    defaultValue: "PENDING",
  })
  status!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tx_ref!: string;

  @ForeignKey(() => User)
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;
}
export default Payment;
