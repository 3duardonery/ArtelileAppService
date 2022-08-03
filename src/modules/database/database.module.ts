import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: process.env.CONNECTION,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(`${process.env.CONNECTION}/${process.env.DATABASE}`),
  },
];

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
