import { Module } from '@nestjs/common';
import { WeixinService } from './weixin.service';
import { WeixinController } from './weixin.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WeixinController],
  providers: [WeixinService]
})
export class WeixinModule {}
