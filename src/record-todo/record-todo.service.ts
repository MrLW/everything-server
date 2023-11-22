import { Injectable } from '@nestjs/common';
import { CreateRecordTodoDto } from './dto/create-record-todo.dto';
import { UpdateRecordTodoDto } from './dto/update-record-todo.dto';
import { PrismaService } from 'src/prisma.service';
import { ListRecordTodoDto } from './dto/list-record-todo.dto';

@Injectable()
export class RecordTodoService {

  constructor(private prisma: PrismaService,) { }

  create(createRecordTodoDto: CreateRecordTodoDto) {
    return this.prisma.et_todo.create({ data:  createRecordTodoDto});
  }

  async findAll(userId: number,  listDto :ListRecordTodoDto) {
    const condition =  { userId, deleted: false };
    if(listDto.selectTag == 'done'){
      condition['done'] = true;
    }else if(listDto.selectTag == 'no') {
      condition['done'] = false;
    }
    if(listDto.startDay){
      condition['startDay'] = listDto.startDay;
    }
    const res = await this.prisma.et_todo.findMany({
      where: {
        ...condition,
      },
      select: {
        id: true,
        title: true,
        content: true,
        done: true,
      },
      take: ~~listDto.pageSize,
      skip: (listDto.pageNum-1)*listDto.pageSize
    });
    return res;
  }

  async findOne(id: number) {
    const todo = await this.prisma.et_todo.findFirst({ where: { id }, select: { id: true, title: true, content: true, startDay: true, startTime: true, duration: true }})
    return todo;
  }

  async updateDone(id: number, done: boolean) {
    await this.prisma.et_todo.update({ where: { id }, data: { done: done } })
  }

  async update(id: number, todo: UpdateRecordTodoDto) {
    await this.prisma.et_todo.update({ where: { id }, data: todo })
  } 

  remove(id: number) {
    return `This action removes a #${id} recordTodo`;
  }
}
