import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecordDayLoveMomentService } from './record-day-love-moment.service';
import { CreateRecordDayLoveMomentDto } from './dto/create-record-day-love-moment.dto';
import { UpdateRecordDayLoveMomentDto } from './dto/update-record-day-love-moment.dto';

@Controller('recordDayLoveMoment')
export class RecordDayLoveMomentController {
  constructor(private readonly recordDayLoveMomentService: RecordDayLoveMomentService) {}

  @Post()
  create(@Body() createRecordDayLoveMomentDto: CreateRecordDayLoveMomentDto) {
    return this.recordDayLoveMomentService.create(createRecordDayLoveMomentDto);
  }

  @Get()
  findAll() {
    return this.recordDayLoveMomentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordDayLoveMomentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDayLoveMomentDto: UpdateRecordDayLoveMomentDto) {
    return this.recordDayLoveMomentService.update(+id, updateRecordDayLoveMomentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordDayLoveMomentService.remove(+id);
  }

  @Patch(':id/love')
  love(@Param('id') id: string){
    return this.recordDayLoveMomentService.like(~~id);
  }

  @Patch(':id/star')
  star(@Param('id') id: string){
    return this.recordDayLoveMomentService.star(~~id);
  }
}
