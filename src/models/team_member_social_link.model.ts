import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import TeamMember from "./team_member.model";

@Table({
  timestamps: true,
  tableName: "team_member_social_links",
})
class TeamMemberSocialLink extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => TeamMember)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  team_member_id!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  platform!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  url!: string;

  @BelongsTo(() => TeamMember)
  team_member!: TeamMember;
}

export default TeamMemberSocialLink;
