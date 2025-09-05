import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import PortfolioItem from "./portfolio_item.model";

@Table({
  timestamps: true,
  tableName: "portfolio_item_tags",
})
class PortfolioItemTag extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => PortfolioItem)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  portfolio_item_id!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  tag_name!: string;

  @BelongsTo(() => PortfolioItem)
  portfolio_item!: PortfolioItem;
}

export default PortfolioItemTag;
