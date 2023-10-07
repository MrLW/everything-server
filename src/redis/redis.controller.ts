import { Controller, Get, Logger, Param } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Ret } from 'src/common/ret';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get(':key')
  async getkey(@Param('key') key: string) {
    const res = await this.redisService.getValue(key);
    return Ret.ok(res)
  }
}
