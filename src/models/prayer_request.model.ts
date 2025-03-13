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
class PrayerRequest extends Model {
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

  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  gender!: string;

  @Column({ type: DataType.INTEGER })
  age!: number;

  //   @Column(DataType.DOUBLE)
  //   amount!: number;

  @Column(DataType.STRING)
  prayer_issue!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  other_prayer_issue!: string;

  @Column(DataType.STRING)
  address!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  prayer_issue_description!: string;
}

export default PrayerRequest;
