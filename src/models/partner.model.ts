import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  timestamps: true,
})
class Partner extends Model {
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

  //   @Column(DataType.STRING)
  //   partnership_type!: string;

  //   @Column({ type: DataType.STRING, allowNull: true })
  //   package_plan!: string;

  //   @Column(DataType.DOUBLE)
  //   amount!: number;

  //   @Column(DataType.STRING)
  //   payment_method!: string;

  //   @Column({ type: DataType.STRING, allowNull: true })
  //   additional_message!: string;

  //   @Column({ type: DataType.DATE, allowNull: true })
  //   due_date!: Date;

  //   @HasMany(() => Payment)
  // //   payments!: Payment[];

  //   @ForeignKey(() => User)
  //   user_id!: number;

  //   @HasOne(() => User)
  //   user!: User[];
}

export default Partner;
