import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecordDayCategoryService } from './record-day-category.service';
import { CreateRecordDayCategoryDto } from './dto/create-record-day-category.dto';
import { UpdateRecordDayCategoryDto } from './dto/update-record-day-category.dto';

@Controller('recordDayCategory')
export class RecordDayCategoryController {
  constructor(private readonly recordDayCategoryService: RecordDayCategoryService) {}

  @Post()
  create(@Body() createRecordDayCategoryDto: CreateRecordDayCategoryDto) {
    return this.recordDayCategoryService.create(createRecordDayCategoryDto);
  }

  @Get()
  findAll() {
    return this.recordDayCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordDayCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDayCategoryDto: UpdateRecordDayCategoryDto) {
    return this.recordDayCategoryService.update(+id, updateRecordDayCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordDayCategoryService.remove(+id);
  }
}
