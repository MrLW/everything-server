import { Test, TestingModule } from '@nestjs/testing';
import { RecordDayLoveCommentService } from './record-day-love-comment.service';

describe('RecordDayLoveCommentService', () => {
  let service: RecordDayLoveCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordDayLoveCommentService],
    }).compile();

    service = module.get<RecordDayLoveCommentService>(RecordDayLoveCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
