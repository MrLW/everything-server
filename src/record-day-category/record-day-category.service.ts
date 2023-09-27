import { Injectable } from '@nestjs/common';
import { CreateRecordDayCategoryDto } from './dto/create-record-day-category.dto';
import { UpdateRecordDayCategoryDto } from './dto/update-record-day-category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RecordDayCategoryService {
  constructor(private prisma: PrismaService) { }

  create(createRecordDayCategoryDto: CreateRecordDayCategoryDto) {
    return 'This action adds a new recordDayCategory';
  }

  findAll() {
    return this.prisma.et_day_category.findMany({ select: { id: true, type: true, className: true, name: true } });
  }

  async getCategoryMap(){
    const categoryList = await this.prisma.et_day_category.findMany({ select: { id: true, type: true, className: true, name: true } });
    return categoryList.reduce((pre, cur) => Object.assign(pre, {[cur.type]: {className: cur.className, name: cur.name } }), {})
  }

  findOne(id: number) {
    return `This action returns a #${id} recordDayCategory`;
  }

  update(id: number, updateRecordDayCategoryDto: UpdateRecordDayCategoryDto) {
    return `This action updates a #${id} recordDayCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} recordDayCategory`;
  }
}
