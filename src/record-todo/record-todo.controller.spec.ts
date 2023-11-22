import { Test, TestingModule } from '@nestjs/testing';
import { RecordTodoController } from './record-todo.controller';
import { RecordTodoService } from './record-todo.service';

describe('RecordTodoController', () => {
  let controller: RecordTodoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordTodoController],
      providers: [RecordTodoService],
    }).compile();

    controller = module.get<RecordTodoController>(RecordTodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
