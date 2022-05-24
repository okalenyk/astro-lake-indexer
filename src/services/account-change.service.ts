import { Repository } from 'typeorm';
import * as Near from '../near';
import { AppDataSource } from '../data-source';
import { AccountChange, AccountChangeReason } from '../entities';

class AccountChangeService {
  constructor(
    private readonly repository: Repository<AccountChange> = AppDataSource.getRepository(
      AccountChange,
    ),
  ) {}

  fromJSON(
    blockHash: string,
    blockTimestamp: number,
    indexInBlock: number,
    stateChange: Near.StateChange,
  ) {
    let account: Near.Account | undefined;
    let transactionHash: string | undefined;
    let receiptId: string | undefined;

    switch (stateChange.cause.type) {
      case Near.StateChangeCauseTypes.TransactionProcessing:
        transactionHash = stateChange.cause.tx_hash;
        break;

      case Near.StateChangeCauseTypes.ActionReceiptProcessingStarted:
      case Near.StateChangeCauseTypes.ActionReceiptGasReward:
      case Near.StateChangeCauseTypes.ReceiptProcessing:
      case Near.StateChangeCauseTypes.PostponedReceipt:
        receiptId = stateChange.cause.receipt_hash;
        break;
    }

    switch (stateChange.type) {
      case Near.StateChangeTypes.AccountUpdate:
        account = stateChange.change as Near.Account;
        break;
    }

    const reason = Object.keys(Near.StateChangeCauseTypes)[
      Object.values(Near.StateChangeCauseTypes).indexOf(stateChange.cause.type)
    ];

    return this.repository.create({
      affected_account_id: stateChange.change.account_id,
      changed_in_block_timestamp: BigInt(blockTimestamp),
      changed_in_block_hash: blockHash,
      caused_by_transaction_hash: transactionHash,
      caused_by_receipt_id: receiptId,
      update_reason:
        AccountChangeReason[reason as keyof typeof AccountChangeReason],
      affected_account_nonstaked_balance: BigInt(account?.amount || 0),
      affected_account_staked_balance: BigInt(account?.locked || 0),
      affected_account_storage_usage: BigInt(account?.storage_usage || 0),
      index_in_block: indexInBlock,
    });
  }

  async store(block: Near.Block, shards: Near.Shard[]) {
    const entities = shards
      .map((shard) =>
        shard.state_changes.map((stateChange, index) =>
          this.fromJSON(
            block.header.hash,
            block.header.timestamp,
            index,
            stateChange,
          ),
        ),
      )
      .flat();

    return this.repository.save(entities);
  }
}

export const accountChangeService = new AccountChangeService();
