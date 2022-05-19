import 'dotenv/config';
import { Provider } from 'nconf';

export class Config {
  private provider: Provider;

  constructor() {
    this.provider = new Provider();
    this.provider.env();
    this.provider.defaults({
      LOG_LEVEL: 'info',
    });
    this.provider.required([
      'LOG_LEVEL',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_REGION',
      'AWS_BUCKET',
      'DATABASE_TYPE',
      'DATABASE_HOST',
      'DATABASE_PORT',
      'DATABASE_USERNAME',
      'DATABASE_PASSWORD',
      'DATABASE_NAME',
      'START_BLOCK_HEIGHT',
    ]);
  }

  get LOG_LEVEL(): string {
    return this.provider.get('LOG_LEVEL');
  }

  get AWS_ACCESS_KEY_ID(): string {
    return this.provider.get('AWS_ACCESS_KEY_ID');
  }

  get AWS_SECRET_ACCESS_KEY(): string {
    return this.provider.get('AWS_SECRET_ACCESS_KEY');
  }

  get AWS_REGION(): string {
    return this.provider.get('AWS_REGION');
  }

  get AWS_BUCKET(): string {
    return this.provider.get('AWS_BUCKET');
  }

  get DATABASE_TYPE(): 'postgres' {
    return this.provider.get('DATABASE_TYPE');
  }

  get DATABASE_HOST(): string {
    return this.provider.get('DATABASE_HOST');
  }

  get DATABASE_PORT(): number {
    return parseInt(this.provider.get('DATABASE_PORT'));
  }

  get DATABASE_USERNAME(): string {
    return this.provider.get('DATABASE_USERNAME');
  }

  get DATABASE_PASSWORD(): string {
    return this.provider.get('DATABASE_PASSWORD');
  }

  get DATABASE_NAME(): string {
    return this.provider.get('DATABASE_NAME');
  }

  get START_BLOCK_HEIGHT(): number {
    return parseInt(this.provider.get('START_BLOCK_HEIGHT'));
  }
}

export default new Config();
