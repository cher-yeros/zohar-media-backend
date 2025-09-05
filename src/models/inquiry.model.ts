import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { InquiryStatus, InquiryType } from "../enums";
import TeamMember from "./team_member.model";

@Table({
  timestamps: true,
  tableName: "inquiries",
})
class Inquiry extends Model {
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
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  subject!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  inquiry_date!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(InquiryStatus)),
    allowNull: false,
    defaultValue: InquiryStatus.UNREAD,
  })
  status!: InquiryStatus;

  @Column({
    type: DataType.ENUM(...Object.values(InquiryType)),
    allowNull: false,
    defaultValue: InquiryType.GENERAL,
  })
  type!: InquiryType;

  @ForeignKey(() => TeamMember)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  assigned_to?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  response?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  response_date?: Date;

  @BelongsTo(() => TeamMember)
  assigned_team_member?: TeamMember;
}

export default Inquiry;
