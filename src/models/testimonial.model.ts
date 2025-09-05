import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { TestimonialStatus } from "../enums";
import PortfolioItem from "./portfolio_item.model";

@Table({
  timestamps: true,
  tableName: "testimonials",
})
class Testimonial extends Model {
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
    type: DataType.STRING(255),
    allowNull: true,
  })
  company?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  })
  rating?: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  testimonial_date!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(TestimonialStatus)),
    allowNull: false,
    defaultValue: TestimonialStatus.PENDING,
  })
  status!: TestimonialStatus;

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
  avatar_url?: string;

  @ForeignKey(() => PortfolioItem)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  portfolio_item_id?: string;

  @BelongsTo(() => PortfolioItem)
  portfolio_item?: PortfolioItem;
}

export default Testimonial;
