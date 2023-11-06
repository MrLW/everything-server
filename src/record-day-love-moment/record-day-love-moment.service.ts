import { Injectable, Logger } from '@nestjs/common';
import { CreateRecordDayLoveMomentDto } from './dto/create-record-day-love-moment.dto';
import { UpdateRecordDayLoveMomentDto } from './dto/update-record-day-love-moment.dto';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { FindRecordDayLoveMomentDto } from './dto/find-record-day-love-moment.dto';


@Injectable()
export class RecordDayLoveMomentService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  private domain: string = this.config.get("DOMAIN");

  create(createRecordDayLoveMomentDto: CreateRecordDayLoveMomentDto) {
    const imageKeyList: string[] = [];
    for(let image of createRecordDayLoveMomentDto.images){
      const key = '/moment/' + Date.now()+ '.jpg';
      const localpath = path.join(__dirname,'../../../public/',  key); // TODO
      fs.writeFileSync(localpath, Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64'));
      imageKeyList.push(key);
    }
    return this.prisma.et_day_love_moment.create({ data: Object.assign(createRecordDayLoveMomentDto, { images: JSON.stringify(imageKeyList) })})
  }

  async findAll(userId: number, req: FindRecordDayLoveMomentDto) {
    const res = await this.prisma.et_day_love_moment.findMany({ 
      where: { public: true },
      skip: req.pageSize * (req.pageNum-1),
      take: ~~req.pageSize,
      include: { et_user:  true, }
    });
    const mappingList = await this.prisma.et_day_love_moment_mapping.findMany({ where: { type: 'love' , momentId: { in: res.map(item => item.id )} } })
    const mappingMap = mappingList.reduce((pre, cur) => Object.assign(pre, {[cur.momentId]: cur.userId }), {})
    for(let item of res){
      const images = JSON.parse(item.images) as string[];
      item['cover'] = images.length > 0 ? this.domain + images[0]: 'https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg';
      // 判断当前用户是否喜欢瞬间
      item['loved'] = userId == mappingMap[item.id];
    }
    return res;
  }

  async findOne(id: number, userId: number) {
    const domain = this.config.get("DOMAIN");
    const res = await this.prisma.et_day_love_moment.findUnique({ where: { id  } });
    if(!res || !res.images) return res;
    const images = JSON.parse(res.images) as string[];
    const loved = await this.prisma.et_day_love_moment_mapping.count({ where: { momentId: id, userId, type: 'love' } })
    const stared = await this.prisma.et_day_love_moment_mapping.count({ where: { momentId: id, userId, type: 'star' } })
    return Object.assign(res, { loved: !!loved, stared: !!stared, images: images.map(image => domain + image)});
  }


  /**
   * 点赞
   * @param id 瞬间id
   * @param userId 用户id
   */
  async like(id: number, incre: number, userId: number,){
    if(incre > 0){
      await this.prisma.et_day_love_moment_mapping.create({
        data: {
          userId ,
          momentId: id,
          type: 'love'  
        }
      })
    }else {
      await this.prisma.et_day_love_moment_mapping.deleteMany({ where: { userId, momentId: id , type: 'love'} });
    }
    await this.prisma.et_day_love_moment.update({
      where: { id },
      data: {
        loves: { increment: incre }
      } 
    })
    // 增加本人的喜欢数量
    await this.prisma.et_user.update({
      where: { id: userId },
      data: {
        loves: { increment: incre }
      }
    })
  }
  /**
   * 收藏
   * @param id 
   */
  async star(id: number, incre: number, userId: number){
    
    incre > 0 ? 
      await this.prisma.et_day_love_moment_mapping.create({ data: { userId,  momentId: id,  type: 'star', } }): 
      await this.prisma.et_day_love_moment_mapping.deleteMany({ where: { userId, momentId: id, type: 'star'} })
    
    await this.prisma.et_day_love_moment.update({
      where: { id },
      data: {
        stars: { increment: incre }
      } 
    })
    // 增加本人的收藏数量
    await this.prisma.et_user.update({
      where: { id: userId },
      data: {
        loves: { increment: incre }
      }
    })
  }

  /**
   * 获取用户的瞬间
   * @param userId 用户id
   */
  async loveMoments(userId: number, ispublic: boolean){
    const res = await this.prisma.et_day_love_moment.findMany({
      where: { userId , public:  ispublic },
      include: {
        et_user: {
          select: {
            avatarUrl: true,
            username: true,
          }
        },
      },
    })
    const mappingList = await this.prisma.et_day_love_moment_mapping.findMany({ where: { type: 'love' , momentId: { in: res.map(item => item.id )} } })
    const mappingMap = mappingList.reduce((pre, cur) => Object.assign(pre, {[cur.momentId]: cur.userId }), {})
    for(let item of res){
      const images = JSON.parse(item.images) as string[];
      item['cover'] = images.length > 0 ? this.domain + images[0]: 'https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg';
      // 判断当前用户是否喜欢瞬间
      item['loved'] = userId == mappingMap[item.id];
    }
    return res;
  }

  /**
   * 获取用户点赞/收藏的瞬间
   * @param userId 用户id
   * @param type 类型
   */
  async loveLoveMoments(userId: number, type: 'love' | 'star'){
    const mappingList = await this.prisma.et_day_love_moment_mapping.findMany({
      where: {
        userId,
        type,
      },
      include: {
        et_day_love_moment: {
          include: {
            et_user: true,
          }
        }
      }
    })
    const momentList = mappingList.map(mapping => mapping.et_day_love_moment);
    for(let item of momentList){
      const images = JSON.parse(item.images) as string[];
      item['cover'] = images.length > 0 ? this.domain + images[0]: 'https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg';
      item['loved'] = true;
    }
    return momentList;
  }

  /**
   * 获取好友的瞬间
   * @param friendId 
   */
  async friendLoveMoments(userId: number, friendId: number) {
    const momentList = await this.prisma.et_day_love_moment.findMany({
      where: { userId: friendId },
      include: {
        et_user: {
          select: { id: true, avatarUrl: true, username: true }
        }
      }
    })
    const mappingList = await this.prisma.et_day_love_moment_mapping.findMany({ where: { type: 'love' , momentId: { in: momentList.map(item => item.id )} } })
    const mappingMap = mappingList.reduce((pre, cur) => Object.assign(pre, {[cur.momentId]: cur.userId }), {})
    for(let item of momentList){
      const images = JSON.parse(item.images) as string[];
      item['cover'] = images.length > 0 ? this.domain + images[0]: 'https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg';
       // 判断当前用户是否喜欢瞬间
       item['loved'] = userId == mappingMap[item.id];
    }
    return momentList;
  }
}
