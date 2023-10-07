import { Body, Controller, Logger, Post } from '@nestjs/common';
import { WeixinService } from './weixin.service';
import { JscodeToSessionDto } from './dto/jscode-to-session';
import { SkipAuth } from 'src/user/metadata';

@Controller('weixin')
export class WeixinController {
  constructor(private readonly weixinService: WeixinService) {}

  @Post('jscode2session')
  @SkipAuth()
  create(@Body() jsonToSessionDto: JscodeToSessionDto) {
    return this.weixinService.jscode2session(jsonToSessionDto);
  }
}
