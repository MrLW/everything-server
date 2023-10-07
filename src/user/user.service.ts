import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { et_user } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';
import config from '../../config/local'
import { jwtConstants, redisConstants } from 'src/common/constants';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, 
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService ) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.et_user.findFirst({ where: { openid: createUserDto.openid }})
    if(!user){
      await this.prisma.et_user.create({ data: createUserDto});
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
    this.redisService.setex(redisConstants.tokenKeyPrefix+token, jwtConstants.expiresIn, 1+ '');
    return { token };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(openid: string, updateUserDto: UpdateUserDto) {
    const exist = await this.prisma.et_user.count({ where: { openid } })
    if(exist) {
      await this.prisma.et_user.updateMany({ where: { openid }, data: updateUserDto })    
    }else {
      const other: any = { openid }
      await this.prisma.et_user.create({ data: Object.assign( updateUserDto, other )})
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
  async token(openid: string){
    const user = await this.prisma.et_user.findFirst({ where: { openid } })
    if(!user) return null;
    const token = await this.jwtService.signAsync({ type: 'JWT', 'alg': 'HS256', ...user }, { 'secret': 'everything' })
    // 设置过期时间
    await this.redisService.setex(`et:user:token:${token}`, config.expired, 1 + '' );
    return token;
  }

  /**
   * 解析用户token
   * @param token 用户token
   * @returns 用户信息
   */
  async verify(token: string){
    const res = await this.redisService.getValue(token);
    if(!res) {
       throw `token 已过期, 请重新登录`;
    }
    try {
      const res = await this.jwtService.verifyAsync(token, { 'secret': 'everything'}) as et_user;
      return res;
    } catch (error) {
      Logger.error(error)
      throw error;      
    }
  }

  /**
   *  退出登录
   */
  async logout(token: string){
    await this.redisService.del(token);
  }
}
