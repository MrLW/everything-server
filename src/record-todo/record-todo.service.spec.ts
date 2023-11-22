import { Test, TestingModule } from '@nestjs/testing';
import { RecordTodoService } from './record-todo.service';

describe('RecordTodoService', () => {
  let service: RecordTodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordTodoService],
    }).compile();

    service = module.get<RecordTodoService>(RecordTodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
