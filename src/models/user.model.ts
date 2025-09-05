import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { UserRole } from "../enums";
import ActivityLog from "./activity_log.model";

@Table({
  timestamps: true,
  tableName: "users",
})
class User extends Model {
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
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password_hash!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  first_name!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  last_name!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.ADMIN,
  })
  role!: UserRole;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  avatar_url?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  last_login_at?: Date;

  @HasMany(() => ActivityLog)
  activity_logs!: ActivityLog[];
}

export default User;
