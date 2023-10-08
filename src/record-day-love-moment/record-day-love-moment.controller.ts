import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RecordDayLoveMomentService } from './record-day-love-moment.service';
import { CreateRecordDayLoveMomentDto } from './dto/create-record-day-love-moment.dto';
import { UpdateRecordDayLoveMomentDto } from './dto/update-record-day-love-moment.dto';
import { Ret } from 'src/common/ret';

@Controller('recordDayLoveMoment')
export class RecordDayLoveMomentController {
  constructor(private readonly recordDayLoveMomentService: RecordDayLoveMomentService) {}

  @Post()
  async  create(@Body() createRecordDayLoveMomentDto: CreateRecordDayLoveMomentDto) {
    const res = await this.recordDayLoveMomentService.create(createRecordDayLoveMomentDto);
    return Ret.ok(res);
  }

  @Get()
  async  findAll(@Req() req) {
    const res = await this.recordDayLoveMomentService.findAll(req.user.id);
    return Ret.ok(res);
  }

  @Get(':id')
  async  findOne(@Param('id') id: string, @Req() req) {
    const res = await  this.recordDayLoveMomentService.findOne(+id,req.user.id);
    return Ret.ok(res)
  }

  @Patch(':id')
  async  update(@Param('id') id: string, @Body() updateRecordDayLoveMomentDto: UpdateRecordDayLoveMomentDto) {
    const res = await  this.recordDayLoveMomentService.update(+id, updateRecordDayLoveMomentDto);
    return Ret.ok(res)
  }

  @Delete(':id')
   async remove(@Param('id') id: string) {
    const res = await  this.recordDayLoveMomentService.remove(+id);
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
