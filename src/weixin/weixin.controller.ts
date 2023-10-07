import { Body, Controller, Logger, Post } from '@nestjs/common';
import { WeixinService } from './weixin.service';
import { JscodeToSessionDto } from './dto/jscode-to-session';
import { SkipAuth } from 'src/user/metadata';
import { Ret } from 'src/common/ret';

@Controller('weixin')
export class WeixinController {
  constructor(private readonly weixinService: WeixinService) {}

  @Post('jscode2session')
  @SkipAuth()
  async create(@Body() jsonToSessionDto: JscodeToSessionDto) {
    const res = await this.weixinService.jscode2session(jsonToSessionDto);
    return Ret.ok(res)
  }
}
