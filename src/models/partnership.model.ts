import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import User from "./user.model";
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
  firstname!: string;

  @Column({
    allowNull: false,
  })
  lastname!: string;

  @Column({ type: DataType.VIRTUAL })
  get fullname() {
    return `${this.getDataValue("firstname")} ${this.getDataValue("lastname")}`;
  }

  @Column({
    allowNull: true,
  })
  phone?: string;

  @Column({
    allowNull: false,
    unique: true,
  })
  email!: string;

  @ForeignKey(() => User)
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => Payment)
  payments!: Payment[];
}

export default Partnership;
