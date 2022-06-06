import { Repository } from 'typeorm';
import { TransactionActionService } from './transaction-action.service';
import { AppDataSource } from '../data-source';
import { Transaction, TransactionStatus } from '../entities';
import * as Near from '../near';
import { matchAccounts } from '../utils';
import config from '../config';

export class TransactionService {
  private readonly repository: Repository<Transaction>;
  private readonly transactionActionService: TransactionActionService;

  constructor(private readonly manager = AppDataSource.manager) {
    this.repository = manager.getRepository(Transaction);
    this.transactionActionService = new TransactionActionService(manager);
  }

  fromJSON(
    blockHash: string,
    blockTimestamp: bigint,
    chunkHash: string,
    indexInChunk: number,
    transaction: Near.TransactionWithOutcome,
  ) {
    const status = Near.parseKind<Near.ExecutionStatuses>(
      transaction.outcome.execution_outcome.outcome.status,
    );

    return this.repository.create({
      transaction_hash: transaction.transaction.hash,
      included_in_block_hash: blockHash,
      included_in_chunk_hash: chunkHash,
      index_in_chunk: indexInChunk,
      block_timestamp: blockTimestamp,
      signer_account_id: transaction.transaction.signer_id,
      signer_public_key: transaction.transaction.public_key,
      nonce: transaction.transaction.nonce,
      receiver_account_id: transaction.transaction.receiver_id,
      signature: transaction.transaction.signature,
      status: TransactionStatus[status],
      converted_into_receipt_id:
        transaction.outcome.execution_outcome.outcome.receipt_ids[0],
      receipt_conversion_gas_burnt:
        transaction.outcome.execution_outcome.outcome.gas_burnt,
      receipt_conversion_tokens_burnt: BigInt(
        transaction.outcome.execution_outcome.outcome.tokens_burnt,
      ),
      actions: transaction.transaction.actions.map((action, index) =>
        this.transactionActionService.fromJSON(
          transaction.transaction.hash,
          index,
          action,
        ),
      ),
    });
  }

  async save(entity: Transaction[]) {
    return this.repository.save(entity);
  }

  shouldStore(tx: Near.TransactionWithOutcome) {
    return (
      tx.transaction.hash === '8afQFzT9pjrxboLHz3DU391Gt3SXjKwwZhHa3nPRwS3G'
    );

    return (
      matchAccounts(tx.transaction.receiver_id, config.TRACK_ACCOUNTS) ||
      matchAccounts(tx.transaction.signer_id, config.TRACK_ACCOUNTS)
    );
  }

  async findTransactionHashByReceiptId(receiptId: string) {
    const transaction = await this.repository.findOneBy({
      converted_into_receipt_id: receiptId,
    });
    return transaction?.transaction_hash;
  }
}
