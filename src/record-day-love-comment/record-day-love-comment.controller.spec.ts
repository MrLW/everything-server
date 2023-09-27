import { Test, TestingModule } from '@nestjs/testing';
import { RecordDayLoveCommentController } from './record-day-love-comment.controller';
import { RecordDayLoveCommentService } from './record-day-love-comment.service';

describe('RecordDayLoveCommentController', () => {
  let controller: RecordDayLoveCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordDayLoveCommentController],
      providers: [RecordDayLoveCommentService],
    }).compile();

    controller = module.get<RecordDayLoveCommentController>(RecordDayLoveCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
