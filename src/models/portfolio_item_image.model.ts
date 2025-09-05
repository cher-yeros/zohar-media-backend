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
  tableName: "portfolio_item_images",
})
class PortfolioItemImage extends Model {
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
    type: DataType.TEXT,
    allowNull: false,
  })
  image_url!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  alt_text?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  sort_order!: number;

  @BelongsTo(() => PortfolioItem)
  portfolio_item!: PortfolioItem;
}

export default PortfolioItemImage;
