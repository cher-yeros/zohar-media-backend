import { ForeignKey, Model, Table } from "sequelize-typescript";
import Partnership from "./partnership.model";
import Payment from "./payment.model";

@Table
export default class PartnershipPayment extends Model {
  @ForeignKey(() => Partnership)
  partnership_id!: number;

  @ForeignKey(() => Payment)
  payment_id!: number;
}
