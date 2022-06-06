import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AppDataSource } from '../data-source';
import { DataReceipt } from '../entities';
import * as Near from '../near';

export class DataReceiptService {
  private readonly repository: Repository<DataReceipt>;

  constructor(private readonly manager = AppDataSource.manager) {
    this.repository = manager.getRepository(DataReceipt);
  }

  fromJSON(receiptId: string, dataReceipt: Near.DataReceipt) {
    const {
      Data: { data_id, data },
    } = dataReceipt;

    return this.repository.create({
      receipt_id: receiptId,
      data_id: data_id,
      data: data !== null ? Buffer.from(data, 'base64') : null,
    });
  }

  async insert(entities: DataReceipt[]) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .values(entities as QueryDeepPartialEntity<DataReceipt>[])
      .orIgnore()
      .execute();
  }
}
