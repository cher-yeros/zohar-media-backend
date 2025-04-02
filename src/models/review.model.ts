import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Teaching from "./teaching.model";
import User from "./user.model";

@Table
export default class TeachingReview extends Model {
  @ForeignKey(() => Teaching)
  @Column(DataType.INTEGER)
  teaching_id!: number;

  @BelongsTo(() => Teaching)
  teaching!: Teaching;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  email!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  })
  rating!: number; // 1-5 star rating

  @Column(DataType.TEXT)
  comment!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_visible!: boolean; // Admin can hide inappropriate reviews
}
