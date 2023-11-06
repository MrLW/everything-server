import { Injectable } from '@nestjs/common';
import { CreateRecordDayCategoryDto } from './dto/create-record-day-category.dto';
import { UpdateRecordDayCategoryDto } from './dto/update-record-day-category.dto';
import { PrismaService } from 'src/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class RecordDayCategoryService {
  constructor(private prisma: PrismaService) { }

  create(createRecordDayCategoryDto: CreateRecordDayCategoryDto) {
    return 'This action adds a new recordDayCategory';
  }

  async findAll(userId: number) {
    const res = await this.prisma.et_day_category.findMany({ orderBy: { index: 'asc' } , select: { id: true, type: true, className: true, name: true } });
    // 获取当前用户的生日、第上次来姨妈日期、恋爱日期、结婚日期
    const user = await this.prisma.et_user.findFirst({ where: { id: userId }, select: { birthday: true } });
    const birthday = user.birthday;
    const birthdayDiff = dayjs().diff(user.birthday, 'days');
    if(birthday) {
      const mensesCategory = res.find(item => item.type == 'birthday');
      mensesCategory['startTime'] = birthday;
      mensesCategory['diffDays'] = dayjs().diff(birthday, 'days');
    }
    const events = await this.prisma.et_event.findMany({ where: { userId, type: { in: ['menses', 'love', 'marry']} }, select: { startTime: true, type: true }, orderBy: { startTime: 'desc' } });
    const mensesEvent = events.find(event => event.type == 'menses');
    if(mensesEvent){
      const mensesCategory = res.find(item => item.type == 'menses');
      mensesCategory['startTime'] = mensesEvent.startTime;
      mensesCategory['diffDays'] = dayjs().diff(mensesEvent.startTime, 'days');
    }

    const loveEvent = events.find(event => event.type == 'love');
    if(loveEvent) {
      const mensesCategory = res.find(item => item.type == 'love');
      mensesCategory['startTime'] = loveEvent.startTime;
      mensesCategory['diffDays'] = dayjs().diff(loveEvent.startTime, 'days');
    }

    const marryEvent = events.find(event => event.type == 'marry');
    if(marryEvent) {
      const mensesCategory = res.find(item => item.type == 'marry');
      mensesCategory['startTime'] = marryEvent.startTime;
      mensesCategory['diffDays'] = dayjs().diff(loveEvent.startTime, 'days');
    }
    return res.filter(category=>category.type != 'marry');
  }

  async getCategoryMap(){
    const categoryList = await this.prisma.et_day_category.findMany({ select: { id: true, type: true, className: true, name: true, index: true } });
    return categoryList.reduce((pre, cur) => Object.assign(pre, {[cur.type]: {className: cur.className, name: cur.name, index: cur.index } }), {})
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
