import { Injectable, Logger } from '@nestjs/common';
import { CreateRecordDayLoveMomentDto } from './dto/create-record-day-love-moment.dto';
import { UpdateRecordDayLoveMomentDto } from './dto/update-record-day-love-moment.dto';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class RecordDayLoveMomentService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  create(createRecordDayLoveMomentDto: CreateRecordDayLoveMomentDto) {
    // const images = JSON.stringify(createRecordDayLoveMomentDto.images);
    const imageKeyList: string[] = [];
    for(let image of createRecordDayLoveMomentDto.images){
      const key = '/moment/' + Date.now()+ '.jpg';
      const localpath = path.join(__dirname,'../../public/',  key);
      fs.writeFileSync(localpath, Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64'));
      imageKeyList.push(key);
    }
    return this.prisma.et_day_love_moment.create({ data: Object.assign(createRecordDayLoveMomentDto, { images: JSON.stringify(imageKeyList) })})
  }

  async findAll() {
    const domain = this.config.get("DOMAIN");

    const res = await this.prisma.et_day_love_moment.findMany({ where: { public: true } });
    for(let item of res){
      const images = JSON.parse(item.images) as string[];
      item['cover'] = images.length > 0 ? domain + images[0]: 'https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg' 
    }
    return res;
  }

  async findOne(id: number) {
    const domain = this.config.get("DOMAIN");
    const res = await this.prisma.et_day_love_moment.findUnique({ where: { id  } });
    if(!res || !res.images) return res;
    const images = JSON.parse(res.images) as string[];
    return Object.assign(res, { images: images.map(image => domain + image)});
  }

  update(id: number, updateRecordDayLoveMomentDto: UpdateRecordDayLoveMomentDto) {
    return `This action updates a #${id} recordDayLoveMoment`;
  }

  remove(id: number) {
    return `This action removes a #${id} recordDayLoveMoment`;
  }

  /**
   * 点赞
   * @param id 瞬间id
   */
  async like(id: number){
    this.prisma.et_day_love_moment_love_mapping.create({
      data: {
        userId: 1,
        momentId: id,
        type: 'love'  
      }
    })
    await this.prisma.et_day_love_moment.update({
      where: { id },
      data: {
        loves: { increment: 1 }
      } 
    })
  }
  /**
   * 收藏
   * @param id 
   */
  async star(id: number){
    this.prisma.et_day_love_moment_love_mapping.create({
      data: {
        userId: 1,
        momentId: id,
        type: 'star',
      }
    })
    await this.prisma.et_day_love_moment.update({
      where: { id },
      data: {
        stars: { increment: 1 }
      } 
    })
  }
}
