import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/prisma.service';
import { RecordDayCategoryService } from 'src/record-day-category/record-day-category.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService, RecordDayCategoryService],
})
export class EventsModule {}
