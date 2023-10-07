import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RecordDayLoveCommentService } from './record-day-love-comment.service';
import { CreateRecordDayLoveCommentDto } from './dto/create-record-day-love-comment.dto';
import { UpdateRecordDayLoveCommentDto } from './dto/update-record-day-love-comment.dto';
import { Ret } from 'src/common/ret';

@Controller('recordDayLoveComment')
export class RecordDayLoveCommentController {
  constructor(private readonly recordDayLoveCommentService: RecordDayLoveCommentService) {}

  @Post()
  async create(@Body() createRecordDayLoveCommentDto: CreateRecordDayLoveCommentDto) {
    const res = await  this.recordDayLoveCommentService.create(createRecordDayLoveCommentDto);
    return Ret.ok(res);
  }

  @Get()
  async findAll(@Query('momentId') momentId: string) {
    const res = await  this.recordDayLoveCommentService.findAllByMomentId(~~momentId);
    return Ret.ok(res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await  this.recordDayLoveCommentService.findOne(+id);
    return Ret.ok(res);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRecordDayLoveCommentDto: UpdateRecordDayLoveCommentDto) {
    const res = await this.recordDayLoveCommentService.update(+id, updateRecordDayLoveCommentDto);
    return Ret.ok(res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await  this.recordDayLoveCommentService.remove(+id);
    return Ret.ok(res);
  }
}
