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
import * as nodemailer from 'nodemailer'

export type Message = {
  content: string;
  sendId: number;
  receId: number;  
}

import { ConfigService } from '@nestjs/config';
import { SocketGateway } from 'src/socket/socket.gateway';
import { SOCKET_EVENT_NAME } from 'src/socket/constant';
import { UserChatItemList } from './dto/chat-list.dto';
type Friend = {
  id: number;
  avatarUrl: string;
  username: string;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly socket: SocketGateway,
    private readonly redis: RedisService
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
    return { id: otherId, avatarUrl: otherUser.avatarUrl, status: relation.status }
  }

  /**
   * 发送marry 申请
   * @param userId 申请人 的id
   * @param receEid 被申请人的EID
   */
  async marryApply(userId: number, receEid: string) {
    const target = await this.prisma.et_user.findFirst({ where: { eid: receEid }});
    if(!target) {
      throw new GoneException("您输入的EID不存在!");
    }
    const relation = await this.prisma.et_user_relation.findFirst({ where: { sendId: userId, type: 'marry' }})
    if(relation && relation.receId == target.id) throw new GoneException("您已发送好友申请！")
    if(relation){
      await this.prisma.et_user_relation.delete({where: { id: relation.id }})
    }

    await this.prisma.et_user_relation.create({
      data: { sendId: userId, receId: target.id, type: 'marry', status: 'apply'}
    })

    // 发送消息
    const sender = await this.prisma.et_user.findFirst({ where: { id: userId }, select: { username: true } })
    await this.prisma.et_message.create({
      data: {
        userId: target.id, title: sender.username, content: `向你发送了好友申请`, data: JSON.stringify({sendId: userId, receId: target.id})
      }
    })
    // 通知发送消息更新
    this.socket.emit(target.id, SOCKET_EVENT_NAME.USER_MESSAGE_LIST, {});
    return this.marryInfo(userId);
  }

  /**
   * 发送消息
   * @param message 
   */
  async sendMessage(message: Message){
    const res = await this.prisma.et_chat.create({ data: message });
    const user = await this.prisma.et_user.findFirst({ where: { id: message.sendId }, select: { avatarUrl: true } })
    res['avatarUrl']=user.avatarUrl;
    // 通过socket 发送消息
    this.socket.emit(message.sendId, SOCKET_EVENT_NAME.USER_CHAT_ADD, Object.assign({ isMe : true }, res))
    this.socket.emit(message.receId, SOCKET_EVENT_NAME.USER_CHAT_ADD, Object.assign( { isMe : false }, res))
    return res;
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

  /**
   *  发送邮箱验证码
   */
  async sendEmailCode(email: string) {
    // 验证邮箱
    if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)){
      throw new GoneException("邮箱格式不正确, 请确认后再发送");
    }

    const config = {
      host: "smtp.163.com",
      port: 465,
      secure: true,
      auth: {
          user: "leekwe@163.com", // 发送方的邮箱地址
          pass: "NJVSRCTBRERJZISC" // 此处填写你的邮箱授权码
      }
    };
    let transporter = nodemailer.createTransport(config);

    const from = "leekwe@163.com";
    const code = ~~(Math.random()*10000)+1000;
    let mailObj = {
        from,
        to: email,
        subject: 'ET注册验证码',
        text: `您的验证码为: ${code}`
    }
    await new Promise((resolve, reject) => {
        transporter.sendMail(mailObj, async (err, info) => {
            if (err) {
                // new GoneException(err)
                reject(err)
            } else {
                // cache code
                const key = redisConstants.emailKeyPrefix+code;
                const expire = 600;
                await this.redis.setex(key, expire, '1');
                resolve(info)
            }
        })
    })
  }

  /**
   * 邮箱登录
   * @param email 邮箱
   * @param code 验证码
   */
  async verifyCode(email: string, code: string): Promise<{ token: string; user: et_user}>{
    // 校验验证码
    const key = redisConstants.emailKeyPrefix+code;
    const exist = await this.redis.getValue(key)
    Logger.log(`verify code exist: ${exist}`)
    if(!exist) throw new GoneException("验证码错误");

    let user = await this.prisma.et_user.findFirst({ where: { email: email }})
    if(!user){
      user = await this.prisma.et_user.create({ data: { email, eid: "ET" + ~~Math.abs(Math.random() * 100000000), username: 'ET用户', avatarUrl: 'http://192.168.20.221:3000/avatar/默认头像.png' } })
    }
    // 
    const token = await this.jwtService.signAsync(user, { secret: jwtConstants.secret });
    await this.redisService.setex(redisConstants.tokenKeyPrefix + token, jwtConstants.expiresIn, 1 + '');
    // 获取当前用户信息
    return { token, user };
  }


  /**
   * 获取聊天记录列表
   * @param id 用户id
   * @param friendId 好友id
   */
  async chatList(id: number,  userChatItemListReq: UserChatItemList){
    const friendId = ~~userChatItemListReq.friendId;
    const res = await this.prisma.et_chat.findMany({
      where: { OR: [
        { sendId: id, receId: friendId },
        { receId: id, sendId: friendId },
      ]},
      take: ~~userChatItemListReq.pageSize,
      skip: userChatItemListReq.pageSize * (userChatItemListReq.pageNum-1),
      orderBy: {
        createTime: 'desc'
      }
    })
    const usreList = await this.prisma.et_user.findMany({ select: { id: true, avatarUrl: true, username: true} ,where: { id: { in: [id, friendId]} } })
    const userMap = usreList.reduce((pre,cur)=>Object.assign(pre, {[cur.id]: cur}), {})
    
    for(const chat of res){
      chat['sender'] = userMap[chat.sendId]
      chat['receer'] = userMap[chat.receId]
      chat['isMe'] = chat.sendId == id;
      chat['avatarUrl'] = chat['sender']['avatarUrl'];
      delete chat['sender']
      delete chat['receer']
    }
    res.sort((pre, cur) => pre.id - cur.id)
    return res;
  }

  async searchUsers(userId: number, keywork: string){
    const res = await this.prisma.et_user.findMany({
      where: {
        eid: {
          startsWith: `%${keywork}%`
        },
        id: { not: userId}
      },
      select: { id: true, avatarUrl: true, username: true, eid: true }
    })
    const relationList = await this.prisma.et_user_relation.findMany({
      where: {
        sendId: userId
      }
    })
    // 获取当前用户的关注id的列表
    const set = new Set(relationList.map(item => item.receId))
    res.forEach(item =>item['hasSub'] = set.has(item.id) )
    return res;
  }


  /**
   * 关注用户
   * @param userId 发起关注的人
   * @param friendId 被关注的人
   */
  async subscribe(userId: number, friendId: number) {
    await this.prisma.et_user_relation.create({
      data: {
        sendId: userId,
        receId: friendId, 
        status: 'apply',
        type: 'friend'
      }
    })
    await this.prisma.et_user.update({ where: { id: userId }, data: { subs: { increment: 1 } } })
    // TODO: 发送消息给被关注的人
  }

  /**
   * 获取好友列表
   * @param userId 
   */
  async friends(userId: number) {
    const relationList = await this.prisma.et_user_relation.findMany({
      where: {
        OR: [
          { sendId: userId },
          { receId: userId }
        ],
        type: 'friend',
      },
      include: {
        'et_user_et_user_relation_receIdToet_user': {
          select: { id: true, username: true, avatarUrl: true },
        },
        'et_user_et_user_relation_sendIdToet_user': {
          select: { id: true, username: true, avatarUrl: true }
        },
      }
    })
    const friendList : Friend[]= [];
    relationList.forEach(relation => {
      const receer = relation.et_user_et_user_relation_receIdToet_user;
      const sender = relation.et_user_et_user_relation_sendIdToet_user;

      friendList.push(sender.id != userId ? sender: receer)
    })
    return friendList.filter(user=>user.id != userId);
  }

  /**
   * 检查该socket id是否有效
   * @param sid socket 的 id
   */
  async checkSocketValid(sid: string) {
    const res = await this.socket.checkValid(sid);
    return { isValid: res };
  }
}
