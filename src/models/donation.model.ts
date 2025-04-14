import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Payment from "./payment.model";

@Table({
  timestamps: true,
})
class Donation extends Model {
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

  @Column(DataType.DOUBLE)
  amount!: number;

  @Column(DataType.STRING)
  payment_method!: string;

  @Column(DataType.STRING)
  currency!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  additional_message!: string;

  @ForeignKey(() => Payment)
  payment_id!: number;

  @BelongsTo(() => Payment)
  payment!: Payment;
}

export default Donation;
