import { Module } from '@nestjs/common';
import { RecordDayCategoryService } from './record-day-category.service';
import { RecordDayCategoryController } from './record-day-category.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RecordDayCategoryController],
  providers: [RecordDayCategoryService, PrismaService]
})
export class RecordDayCategoryModule {}
