import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

@Module({
  controllers: [RedisController],
  providers: [RedisService], // 提供自身module使用
  exports: [RedisService] // 提供给别的module使用,
})
export class RedisModule {}
