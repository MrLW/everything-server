import { Module } from '@nestjs/common';
import { RecordTodoService } from './record-todo.service';
import { RecordTodoController } from './record-todo.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RecordTodoController],
  providers: [RecordTodoService, PrismaService]
})
export class RecordTodoModule {}
