import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { MediaType } from "../enums";
import MediaItemTag from "./media_item_tag.model";

@Table({
  timestamps: true,
  tableName: "media_items",
})
class MediaItem extends Model {
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
    type: DataType.ENUM(...Object.values(MediaType)),
    allowNull: false,
  })
  type!: MediaType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  url!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  thumbnail_url?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  file_size?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  dimensions?: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  duration?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  upload_date!: Date;

  @HasMany(() => MediaItemTag)
  tags!: MediaItemTag[];
}

export default MediaItem;
