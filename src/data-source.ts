import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from './config';
import {
  AccessKey,
  Account,
  AccountChange,
  ActionReceipt,
  ActionReceiptAction,
  ActionReceiptInputData,
  ActionReceiptOutputData,
  Block,
  Chunk,
  DataReceipt,
  ExecutionOutcome,
  ExecutionOutcomeReceipt,
  Receipt,
  Transaction,
  TransactionAction,
} from './entities';
import { CustomNamingStrategy } from './naming-strategy';

export const AppDataSource = new DataSource({
  type: config.DATABASE_TYPE,
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  username: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: [
    AccessKey,
    Account,
    AccountChange,
    ActionReceipt,
    ActionReceiptAction,
    ActionReceiptInputData,
    ActionReceiptOutputData,
    Block,
    Chunk,
    DataReceipt,
    ExecutionOutcome,
    ExecutionOutcomeReceipt,
    Receipt,
    Transaction,
    TransactionAction,
  ],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
  namingStrategy: new CustomNamingStrategy(),
});
