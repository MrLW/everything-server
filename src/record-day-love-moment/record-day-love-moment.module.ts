import { Module } from '@nestjs/common';
import { RecordDayLoveMomentService } from './record-day-love-moment.service';
import { RecordDayLoveMomentController } from './record-day-love-moment.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RecordDayLoveMomentController],
  providers: [RecordDayLoveMomentService, PrismaService]
})
export class RecordDayLoveMomentModule {}
