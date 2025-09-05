import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import User from "./user.model";

@Table({
  timestamps: true,
  tableName: "activity_logs",
})
class ActivityLog extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  user_id?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  action!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  entity_type!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  entity_id?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: object;

  @BelongsTo(() => User)
  user?: User;
}

export default ActivityLog;
