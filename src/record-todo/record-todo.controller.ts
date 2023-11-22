import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Put } from '@nestjs/common';
import { RecordTodoService } from './record-todo.service';
import { CreateRecordTodoDto } from './dto/create-record-todo.dto';
import { UpdateRecordTodoDto } from './dto/update-record-todo.dto';
import { Ret } from 'src/common/ret';
import { ListRecordTodoDto } from './dto/list-record-todo.dto';

@Controller('todo')
export class RecordTodoController {
  constructor(private readonly recordTodoService: RecordTodoService) {}

  @Post()
  create(@Body() createRecordTodoDto: CreateRecordTodoDto, @Req() req ) {
    createRecordTodoDto.userId = req.user.id;
    return this.recordTodoService.create(createRecordTodoDto);
  }

  @Get()
  async findAll(@Req() req, @Query() listDto :ListRecordTodoDto) {
    const res = await this.recordTodoService.findAll(req.user.id, listDto);
    return Ret.ok(res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.recordTodoService.findOne(+id);
    return Ret.ok(res);
  }

  @Put(':id/done')
  async updateDone(@Param('id') id: string, @Body() updateRecordTodoDto: UpdateRecordTodoDto) {
    console.log("#done", updateRecordTodoDto)
    await this.recordTodoService.updateDone(+id, updateRecordTodoDto.done);
    return Ret.ok()
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRecordTodoDto: UpdateRecordTodoDto) {
    console.log("#done", id,  updateRecordTodoDto)
    await this.recordTodoService.update(+id, updateRecordTodoDto);
    return Ret.ok()
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordTodoService.remove(+id);
  }
}
