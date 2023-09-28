import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.et_user.findFirst({ where: { openid: createUserDto.openid }})
    if(!user){
      await this.prisma.et_user.create({ data: createUserDto});
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findByOpenId(openid: string){
    return this.prisma.et_user.findFirst({ where: { openid: openid }})
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(openid: string, updateUserDto: UpdateUserDto) {
    const exist = await this.prisma.et_user.count({ where: { openid } })
    Logger.log("#update", exist, openid, updateUserDto)
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
}
