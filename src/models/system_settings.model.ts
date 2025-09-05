import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Theme } from "../enums";

@Table({
  timestamps: true,
  tableName: "system_settings",
})
class SystemSettings extends Model {
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
    defaultValue: "Zohar Media",
  })
  business_name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  business_description?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  industry?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  website_url?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  contact_email?: string;

  @Column({
    type: DataType.ENUM(...Object.values(Theme)),
    allowNull: false,
    defaultValue: Theme.LIGHT,
  })
  theme!: Theme;
}

export default SystemSettings;
