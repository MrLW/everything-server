import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { RecordDayLoveMomentService } from './record-day-love-moment.service';
import { CreateRecordDayLoveMomentDto } from './dto/create-record-day-love-moment.dto';
import { UpdateRecordDayLoveMomentDto } from './dto/update-record-day-love-moment.dto';
import { Ret } from 'src/common/ret';
import { FindRecordDayLoveMomentDto } from './dto/find-record-day-love-moment.dto';

@Controller('recordDayLoveMoment')
export class RecordDayLoveMomentController {
  constructor(private readonly recordDayLoveMomentService: RecordDayLoveMomentService) {}

  @Post()
  async  create(@Body() createRecordDayLoveMomentDto: CreateRecordDayLoveMomentDto, @Req() req) {
    createRecordDayLoveMomentDto.userId = req.user.id;
    const res = await this.recordDayLoveMomentService.create(createRecordDayLoveMomentDto);
    return Ret.ok(res);
  }

  @Get()
  async findAll(@Req() req, @Query() query: FindRecordDayLoveMomentDto) {
    const res = await this.recordDayLoveMomentService.findAll(req.user.id, query);
    return Ret.ok(res);
  }

  @Get(':id')
  async  findOne(@Param('id') id: string, @Req() req) {
    const res = await  this.recordDayLoveMomentService.findOne(+id,req.user.id);
    return Ret.ok(res)
  }

  @Patch(':id/love')
  async  love(@Param('id') id: string, @Body('incre') incre: number, @Req() req){
    const res = await  this.recordDayLoveMomentService.like(~~id, incre, req.user.id);
    return Ret.ok(res)
  }

  @Patch(':id/star')
  async  star(@Param('id') id: string, @Body('incre') incre: number, @Req() req){
    const res = await  this.recordDayLoveMomentService.star(~~id, incre, req.user.id);
    return Ret.ok(res)
  }
}
