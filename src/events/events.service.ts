import { Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma.service';
import * as dayjs from 'dayjs'
import { classNameMap, eventTypeMap } from 'src/common';

@Injectable()
export class EventsService {

  constructor(private prisma: PrismaService) { }

  async create(createEventDto: CreateEventDto) {
    const res = await this.prisma.et_event.create({ data: createEventDto })
    return res;
  }

  async findAll() {
    // 先排序, 再分组
    const eventList: any = await this.prisma.$queryRaw`select * from (select * from et_event order by createTime desc limit 1000 ) tmp GROUP BY type`
    for(let item of eventList){
      item['className'] = classNameMap[item.type]
      item['name'] = eventTypeMap[item.type]
      item['diffDays'] = dayjs().diff(item.startTime, 'day');
    }
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
}
