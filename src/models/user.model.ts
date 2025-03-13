import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Partnership from "./partnership.model";
import Payment from "./payment.model";

@Table({
  timestamps: true,
})
class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar?: string;

  @Column({
    allowNull: false,
  })
  first_name!: string;

  @Column({
    allowNull: false,
    defaultValue: "user",
  })
  role!: string;

  @Column({
    allowNull: false,
  })
  last_name!: string;

  @Column({ type: DataType.VIRTUAL })
  get full_name() {
    return `${this.getDataValue("firstname")} ${this.getDataValue("lastname")}`;
  }

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  gender?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    allowNull: true,
  })
  phone?: string;

  @Column({
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dob?: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_verified!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  banned!: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  resetToken?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  resetTokenExpires?: Date;

  // @HasMany(() => Partnership)
  // partnerships!: Partnership[];

  @HasMany(() => Payment)
  user!: Payment[];
}

export default User;
