import { Injectable, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { SOCKET_EVENT_NAME } from 'src/socket/constant';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService, private socket: SocketGateway) {}

  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  async findAll(userId: number) {
    // todo
    const res = await this.prisma.et_message.findMany({ where: { userId: userId }, include: { et_user: { select: { avatarUrl: true } } }})
    for(let item of res){
      const data = JSON.parse(item.data);
      const user = await this.prisma.et_user.findFirst({ where: { id: data.sendId }, select: { avatarUrl: true, id: true, } })
      item['sender'] = user;
    }
    return res;
  }

  /**
   * 同意消息
   * @param id 消息id
   */
  async aggre(id: number) {
    const message = await this.prisma.et_message.findFirst({ where: { id } })
    const { sendId, receId } = JSON.parse(message.data) as { sendId: number; receId: number };
    await this.prisma.et_user_relation.updateMany({ where: { sendId, receId, type: 'marry' }, data: { status: 'success'} })
    await this.prisma.et_message.updateMany({ where: { id }, data: { status: 'complete'} })
    // 发送消息
    this.socket.emit(sendId, SOCKET_EVENT_NAME.USER_MARRY_AGGRE, {});
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
