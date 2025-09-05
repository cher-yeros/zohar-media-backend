import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { PortfolioItemStatus } from "../enums";
import PortfolioCategory from "./portfolio_category.model";
import PortfolioItemImage from "./portfolio_item_image.model";
import PortfolioItemTag from "./portfolio_item_tag.model";
import PortfolioItemTechnology from "./portfolio_item_technology.model";
import PortfolioItemTeamMember from "./portfolio_item_team_member.model";
import Testimonial from "./testimonial.model";

@Table({
  timestamps: true,
  tableName: "portfolio_items",
})
class PortfolioItem extends Model {
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
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @ForeignKey(() => PortfolioCategory)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  category_id?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  thumbnail_url?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  client_name?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  project_date!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(PortfolioItemStatus)),
    allowNull: false,
    defaultValue: PortfolioItemStatus.COMPLETED,
  })
  status!: PortfolioItemStatus;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  featured!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  project_url?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  testimonial?: string;

  @BelongsTo(() => PortfolioCategory)
  category?: PortfolioCategory;

  @HasMany(() => PortfolioItemImage)
  images!: PortfolioItemImage[];

  @HasMany(() => PortfolioItemTag)
  tags!: PortfolioItemTag[];

  @HasMany(() => PortfolioItemTechnology)
  technologies!: PortfolioItemTechnology[];

  @HasMany(() => PortfolioItemTeamMember)
  team_members!: PortfolioItemTeamMember[];

  @HasMany(() => Testimonial)
  testimonials!: Testimonial[];
}

export default PortfolioItem;
