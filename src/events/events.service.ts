import { Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma.service';
import * as dayjs from 'dayjs'
import { RecordDayCategoryService } from 'src/record-day-category/record-day-category.service';

@Injectable()
export class EventsService {

  constructor(private prisma: PrismaService, private categoryService: RecordDayCategoryService) { }

  async create(createEventDto: CreateEventDto, userId: number) {
    const res = await this.prisma.et_event.create({ data: Object.assign(createEventDto, { userId }) })
    if(createEventDto.type == 'birthday'){
      // 更新用户生日
      await this.prisma.et_user.update({ where: { id: userId }, data: { birthday: createEventDto.startTime } })
    }
    return res;
  }

  async findAll(userId: number) {
    const categoryMap = await this.categoryService.getCategoryMap()
    // 先排序, 再分组
    const eventList: any = await this.prisma.$queryRaw`select * from (select * from et_event where deleted = 0 and userId = ${userId} order by startTime desc limit 1000 ) tmp GROUP BY type`
    for(let item of eventList){
      item['className'] = categoryMap[item.type].className;
      item['name'] = categoryMap[item.type].name;
      item['diffDays'] = dayjs().diff(item.startTime, 'day');
      item['index'] = categoryMap[item.type].index;
    }
    eventList.sort((cur,next) => cur.index - next.index)
    return eventList;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return this.prisma.et_event.update({ where: { id }, data: { deleted: true } })
  }

  /**
   *  获取所有的姨妈日期
   */
  async findMenses(userId: number){
    const user = await this.prisma.et_user.findFirst({ where: { id: userId, } , select: { avatarUrl: true }})
    const res = await this.prisma.et_event.findMany({ orderBy: { startTime: 'desc', } , where: { type: 'menses', deleted: false, userId: userId }, select: { id: true, type: true, startTime: true } })
    let i = 0;
    for(; i<res.length-1; i++) {
      res[i]['diffDays'] = dayjs(res[i].startTime).diff(res[i+1].startTime, 'days');
      res[i]['avatarUrl'] = user.avatarUrl;
    }
    res[i]['avatarUrl'] = user.avatarUrl;
    return res;
  }
}
