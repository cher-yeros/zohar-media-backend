import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export default class FAQ extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  question!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  answer!: string;
}
