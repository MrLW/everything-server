import { Controller, Get } from '@nestjs/common';
import { AreaService } from './area.service';
import { Ret } from 'src/common/ret';

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('all')
  async areainfo() {
    const res = await this.areaService.all();
    return Ret.ok(res);
  }
}
