import { Module } from '@nestjs/common';
import { RecordDayLoveCommentService } from './record-day-love-comment.service';
import { RecordDayLoveCommentController } from './record-day-love-comment.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RecordDayLoveCommentController],
  providers: [RecordDayLoveCommentService, PrismaService],
})
export class RecordDayLoveCommentModule {}
