import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RecordDayLoveCommentService } from './record-day-love-comment.service';
import { CreateRecordDayLoveCommentDto } from './dto/create-record-day-love-comment.dto';
import { UpdateRecordDayLoveCommentDto } from './dto/update-record-day-love-comment.dto';

@Controller('recordDayLoveComment')
export class RecordDayLoveCommentController {
  constructor(private readonly recordDayLoveCommentService: RecordDayLoveCommentService) {}

  @Post()
  create(@Body() createRecordDayLoveCommentDto: CreateRecordDayLoveCommentDto) {
    return this.recordDayLoveCommentService.create(createRecordDayLoveCommentDto);
  }

  @Get()
  findAll(@Query('momentId') momentId: string) {
    return this.recordDayLoveCommentService.findAllByMomentId(~~momentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordDayLoveCommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDayLoveCommentDto: UpdateRecordDayLoveCommentDto) {
    return this.recordDayLoveCommentService.update(+id, updateRecordDayLoveCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordDayLoveCommentService.remove(+id);
  }
}
