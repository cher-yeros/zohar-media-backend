// src/models/BibleStudy.ts
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import BibleStudySession from "./bible_study_session.model";
import User from "./user.model";
import Payment from "./payment.model";

@Table
export default class BibleStudyApplication extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  id!: number;

  @Column(DataType.STRING)
  first_name!: string;

  @Column(DataType.STRING)
  last_name!: string;

  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  phone!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  title!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  date!: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  zoom_id!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  zoom_link!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  zoom_passcode!: string;

  @Column(DataType.DOUBLE)
  payment_amount!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => BibleStudySession)
  @Column({ type: DataType.INTEGER, allowNull: true })
  bible_study_session_id!: number;

  @BelongsTo(() => BibleStudySession)
  bible_study_session!: BibleStudySession;

  @Column(DataType.STRING)
  status!: string;

  @ForeignKey(() => Payment)
  payment_id!: number;

  @BelongsTo(() => Payment)
  paymnet!: Payment;
}
