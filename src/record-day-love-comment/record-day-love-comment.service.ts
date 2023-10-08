import { Injectable } from '@nestjs/common';
import { CreateRecordDayLoveCommentDto } from './dto/create-record-day-love-comment.dto';
import { UpdateRecordDayLoveCommentDto } from './dto/update-record-day-love-comment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RecordDayLoveCommentService {
  constructor(private prisma: PrismaService) { }

  create(createRecordDayLoveCommentDto: CreateRecordDayLoveCommentDto) {
    return this.prisma.et_day_love_moment_comment.create({ data: Object.assign(createRecordDayLoveCommentDto, { userId: 1 })})
  }

 async findAllByMomentId(momentId: number) {
    const res = await this.prisma.et_day_love_moment_comment.findMany({ 
      where: { momentId },
      include: {
        et_user: true,
      }
    })
    //
    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} recordDayLoveComment`;
  }

  update(id: number, updateRecordDayLoveCommentDto: UpdateRecordDayLoveCommentDto) {
    return `This action updates a #${id} recordDayLoveComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} recordDayLoveComment`;
  }
}
