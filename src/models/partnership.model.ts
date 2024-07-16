import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import PartnershipPayment from "./partners_payment.model";
import Payment from "./payment.model";

@Table({
  timestamps: true,
})
class Partnership extends Model {
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
    unique: true,
  })
  email!: string;

  @Column(DataType.STRING)
  partnership_type!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  partnership_plan!: string;

  @Column(DataType.DOUBLE)
  amount!: number;

  @Column(DataType.STRING)
  payment_method!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  additional_message!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  due_date!: Date;

  @BelongsToMany(() => Payment, () => PartnershipPayment)
  payments!: Payment[];
}

export default Partnership;
