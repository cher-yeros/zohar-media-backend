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
class Feedback extends Model {
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
  name!: string;

  @Column({
    allowNull: true,
  })
  phone?: string;

  @Column({
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subject!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message!: string;
}

export default Feedback;
