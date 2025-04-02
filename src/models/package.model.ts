import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export default class Package extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  picture!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  features!: object; // Store package-specific features as a JSON object

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price_etb!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price_usd!: number;

  @Column({
    type: DataType.FLOAT,
    defaultValue: 0.0,
  })
  rating!: number;
}
