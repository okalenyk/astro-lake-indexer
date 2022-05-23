import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Block } from './block';
import { Receipt } from './receipt';
import * as transformers from '../transformers';
import { ExecutionStatus } from './types';
import { ExecutionOutcomeReceipt } from './execution-outcome-receipt';

@Entity('execution_outcomes')
export class ExecutionOutcome {
  @PrimaryColumn('text')
  receipt_id: string;

  @Column('text')
  @Index()
  executed_in_block_hash: string;

  @Column('numeric', { precision: 20, transformer: transformers.bigInt })
  @Index()
  executed_in_block_timestamp: bigint;

  @Column('int')
  index_in_chunk: number;

  @Column('numeric', { precision: 20, transformer: transformers.bigInt })
  gas_burnt: bigint;

  @Column('numeric', { precision: 45, transformer: transformers.bigInt })
  tokens_burnt: bigint;

  @Column('text')
  executor_account_id: string;

  @Column('enum', { enum: ExecutionStatus })
  @Index()
  status: ExecutionStatus;

  @Column('numeric', { precision: 20, transformer: transformers.int })
  shard_id: number;

  @ManyToOne(() => Block)
  @JoinColumn({
    name: 'executed_in_block_hash',
    referencedColumnName: 'block_hash',
  })
  block: Block;

  @OneToOne(() => Receipt)
  @JoinColumn({
    name: 'receipt_id',
    referencedColumnName: 'receipt_id',
  })
  receipt: Receipt;

  @OneToMany(
    () => ExecutionOutcomeReceipt,
    (receipt) => receipt.executionOutcome,
    { cascade: true },
  )
  receipts: ExecutionOutcomeReceipt[];
}