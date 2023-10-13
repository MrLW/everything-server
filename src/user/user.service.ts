import { GoneException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { et_user } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';
import config from '../../config/local'
import { jwtConstants, redisConstants } from 'src/common/constants';
import * as path from 'path';
import * as fs from 'fs'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) { 
    let query = 'query' as never, info = 'info' as never, warn = 'warn' as never, error = 'error' as never;
    prisma.$on(query, (e)=>{
      Logger.log(e)
    })
    prisma.$on(info, (e)=>{
      Logger.log(e)
    })
    prisma.$on(warn, (e)=>{
      Logger.log(e)
    })
    prisma.$on(error, (e)=>{
      Logger.log(e)
    })

  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.et_user.findFirst({ where: { openid: createUserDto.openid } })
    if (!user) {
      await this.prisma.et_user.create({ data: createUserDto });
    }
  }

  findAll() {
    return `This action returns all user`;
  }
  /**
   * 微信小程序登录
   * @param openid 微信openid
   * @returns 
   */
  async loginByWx(openid: string) {
    const res = await this.prisma.et_user.findFirst({ where: { openid } });
    const token = await this.jwtService.signAsync(res, { secret: jwtConstants.secret });
    this.redisService.setex(redisConstants.tokenKeyPrefix + token, jwtConstants.expiresIn, 1 + '');
    return { token };
  }

  /**
   * 获取用户信息
   * @param id 用户id
   * @returns 
   */
  info(id: number) {
    return this.prisma.et_user.findFirst({ where: { id } });
  }

  async update(openid: string, updateUserDto: UpdateUserDto) {
    const exist = await this.prisma.et_user.count({ where: { openid } })
    if (exist) {
      await this.prisma.et_user.updateMany({ where: { openid }, data: updateUserDto })
    } else {
      const other: any = { openid }
      await this.prisma.et_user.create({ data: Object.assign(updateUserDto, other) })
    }
    return [];
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  /**
   * 根据微信openid 获取 token
   * @param openid 微信openid
   */
  async token(openid: string) {
    const user = await this.prisma.et_user.findFirst({ where: { openid } })
    if (!user) return null;
    const token = await this.jwtService.signAsync({ type: 'JWT', 'alg': 'HS256', ...user }, { 'secret': 'everything' })
    // 设置过期时间
    await this.redisService.setex(`et:user:token:${token}`, config.expired, 1 + '');
    return token;
  }

  /**
   * 解析用户token
   * @param token 用户token
   * @returns 用户信息
   */
  async verify(token: string) {
    const res = await this.redisService.getValue(token);
    if (!res) {
      throw `token 已过期, 请重新登录`;
    }
    try {
      const res = await this.jwtService.verifyAsync(token, { 'secret': 'everything' }) as et_user;
      return res;
    } catch (error) {
      Logger.error(error)
      throw error;
    }
  }

  /**
   *  退出登录
   */
  async logout(token: string) {
    await this.redisService.del(token);
  }

  /**
   * 更新用户头像
   * @param userId 用户id
   * @param avatar 图片的base64
   */
  async updateAvatarUrl(userId: number, avatar: string) {
    // 1. 将base64下载到本地
    const avatarDiv = path.join(__dirname, '../../../', 'public', 'avatar');
    if (!fs.existsSync(avatarDiv)) {
      fs.mkdirSync(avatarDiv);
    }
    const filename = `${Date.now()}.jpg`;
    const localpath = path.join(avatarDiv, filename);
    fs.writeFileSync(localpath, Buffer.from(avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64'));
    // 2. 更新头像
    const avatarUrl = this.configService.get('DOMAIN') + '/avatar/' + filename;
    await this.prisma.et_user.update({ where: { id: userId }, data: { avatarUrl } })

    return { avatarUrl };
  }


  /**
   * 更新用户的省市区
   * @param codes 省市区的code
   */
  async updateArea(userId: number, codes: string[]) {
    await this.prisma.et_user.update({
      where: { id: userId },
      data: {
        province: codes[0],
        city: codes[1],
        district: codes[2]
      }
    })
  }

  /**
   * 更新用户简介
   * @param userId 用户id
   * @param desc 用户简介
   */
  async updateDesc(userId: number, desc: string) {
    await this.prisma.et_user.update({ where: { id: userId }, data: { desc } })
  }

  /**
   * 更新用户名称
   * @param userId 用户id
   * @param desc 用户名称
   */
  async updateUsername(userId: number, username: string) {
    await this.prisma.et_user.update({ where: { id: userId }, data: { username } })
  }

  /**
   * 更新eid
   * @param userId 用户id
   * @param desc 用户eid
   */
  async updateEid(userId: number, eid: string) {
    if (await this.prisma.et_user.count({ where: { eid } })) {
      throw new GoneException("该EID已存在");
    }
    await this.prisma.et_user.update({ where: { id: userId }, data: { eid } })
    return true;
  }


  /**
  * 更新性别
  * @param userId 用户id
  * @param sex 用户sex
  */
  async updateSex(userId: number, sex: number) {
    await this.prisma.et_user.update({ where: { id: userId }, data: { sex } })
    return true;
  }

  /**
   * 获取该用户的伴侣
   * @param userId 用户id
   * @returns otherId 伴侣id
   */
  async marryInfo(userId: number){
    const relation = await this.prisma.et_user_relation.findFirst({ 
      where: { type: 'marry', OR: [{ sendId: userId, }, { receId: userId }], },
    });
    if(!relation) {
      return null
    }
    const otherId = relation.sendId != userId ? relation.sendId: relation.receId;
    const otherUser = await this.prisma.et_user.findFirst({ where: { id: otherId }, select: { avatarUrl: true }});
    return { otherId, avatarUrl: otherUser.avatarUrl, status: relation.status }
  }

  /**
   * 发送marry 申请
   * @param userId 申请人 的id
   * @param receEId 被申请人的EID
   */
  async marryApply(userId: number, receEId: string) {

    const target = await this.prisma.et_user.findFirst({ where: { eid: receEId }});
    if(!target) {
      throw new GoneException("您输入的EID不存在!");
    }
    const exist = await this.prisma.et_user_relation.findFirst({ where: { sendId: userId, type: 'marry' }})
    if(exist) throw new GoneException("您已发送好友申请！")

    await this.prisma.et_user_relation.create({
      data: { sendId: userId, receId: target.id, type: 'marry', status: 'apply'}
    })
  }

  /**
   *  获取当前伴侣的聊天记录
   */
  async marrayMessage(userId: number){
    // // 1. 判断当前用户是否关联伴侣账号
    // const relationItem = await this.prisma.et_user_relation.findFirst({ where: { OR: [{userId1: userId}, { userId2: userId }], type: 'marry',  } });
    // let otherUserId = 0;
    // if(!relationItem){
    //   return { connected: false, messageList: [], otherUserId: 0 } ;
    // }
    // // 2. 寻找聊天记录
    // otherUserId = relationItem.sendId == userId ? relationItem.receId : relationItem.sendId;
    // const userChatList = await this.prisma.et_chat.findMany({ where: { OR: [ { sendId: userId, recvId: relationItem.userId2 } ]} });
    
    // return { connected: true, otherUserId: otherUserId, userChatList };
  }

}
