import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RecordDayCategoryService } from './record-day-category.service';
import { CreateRecordDayCategoryDto } from './dto/create-record-day-category.dto';
import { UpdateRecordDayCategoryDto } from './dto/update-record-day-category.dto';
import { Ret } from 'src/common/ret';

@Controller('recordDayCategory')
export class RecordDayCategoryController {
  constructor(private readonly recordDayCategoryService: RecordDayCategoryService) {}

  @Post()
  async create(@Body() createRecordDayCategoryDto: CreateRecordDayCategoryDto) {
    const res = await this.recordDayCategoryService.create(createRecordDayCategoryDto);
    return Ret.ok(res);
  }

  @Get()
  async findAll() {
    const res = await this.recordDayCategoryService.findAll();
    return Ret.ok(res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recordDayCategoryService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRecordDayCategoryDto: UpdateRecordDayCategoryDto) {
    const res = await this.recordDayCategoryService.update(+id, updateRecordDayCategoryDto);
    return Ret.ok(res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.recordDayCategoryService.remove(+id);
    return Ret.ok(res);
  }
}
