import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Transaction } from './transaction';

export enum TransactionActionKind {
  CreateAccount = 'CREATE_ACCOUNT',
  DeployContract = 'DEPLOY_CONTRACT',
  FunctionCall = 'FUNCTION_CALL',
  Transfer = 'TRANSFER',
  Stake = 'STAKE',
  AddKey = 'ADD_KEY',
  DeleteKey = 'DELETE_KEY',
  DeleteAccount = 'DELETE_ACCOUNT',
}

export enum PermissionType {
  FullAccess = 'FULL_ACCESS',
  FunctionCall = 'FUNCTION_CALL',
}

@Entity('transaction_actions')
export class TransactionAction {
  @ManyToOne(() => Transaction)
  @JoinColumn({
    name: 'transaction_hash',
    referencedColumnName: 'transaction_hash',
  })
  transaction: Transaction;

  @PrimaryColumn('text')
  transaction_hash: string;

  @PrimaryColumn('int')
  index_in_transaction: number;

  @Column('enum', { enum: TransactionActionKind })
  @Index()
  action_kind: TransactionActionKind;

  @Column('jsonb')
  args: Record<string, unknown>;
}
