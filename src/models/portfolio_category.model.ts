import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import PortfolioItem from "./portfolio_item.model";

@Table({
  timestamps: true,
  tableName: "portfolio_categories",
})
class PortfolioCategory extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.STRING(7),
    allowNull: false,
  })
  color!: string;

  @HasMany(() => PortfolioItem)
  portfolio_items!: PortfolioItem[];
}

export default PortfolioCategory;
