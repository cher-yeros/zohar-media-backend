import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import PortfolioItem from "./portfolio_item.model";
import TeamMember from "./team_member.model";

@Table({
  timestamps: true,
  tableName: "portfolio_item_team_members",
})
class PortfolioItemTeamMember extends Model {
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

  @ForeignKey(() => TeamMember)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  team_member_id!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  role?: string;

  @BelongsTo(() => PortfolioItem)
  portfolio_item!: PortfolioItem;

  @BelongsTo(() => TeamMember)
  team_member!: TeamMember;
}

// Unique constraint is handled by the @Unique decorator in the model definition

export default PortfolioItemTeamMember;
