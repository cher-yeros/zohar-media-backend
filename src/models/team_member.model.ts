import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { TeamMemberStatus } from "../enums";
import TeamMemberSkill from "./team_member_skill.model";
import TeamMemberSocialLink from "./team_member_social_link.model";
import PortfolioItemTeamMember from "./portfolio_item_team_member.model";
import Inquiry from "./inquiry.model";

@Table({
  timestamps: true,
  tableName: "team_members",
})
class TeamMember extends Model {
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
    type: DataType.STRING(100),
    allowNull: false,
  })
  role!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  avatar_url?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  bio?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  join_date!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(TeamMemberStatus)),
    allowNull: false,
    defaultValue: TeamMemberStatus.ACTIVE,
  })
  status!: TeamMemberStatus;

  @HasMany(() => TeamMemberSkill)
  skills!: TeamMemberSkill[];

  @HasMany(() => TeamMemberSocialLink)
  social_links!: TeamMemberSocialLink[];

  @HasMany(() => PortfolioItemTeamMember)
  portfolio_items!: PortfolioItemTeamMember[];

  @HasMany(() => Inquiry)
  assigned_inquiries!: Inquiry[];
}

export default TeamMember;
