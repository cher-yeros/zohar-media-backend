import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import MediaItem from "./media_item.model";

@Table({
  timestamps: true,
  tableName: "media_item_tags",
})
class MediaItemTag extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => MediaItem)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  media_item_id!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  tag_name!: string;

  @BelongsTo(() => MediaItem)
  media_item!: MediaItem;
}

export default MediaItemTag;
