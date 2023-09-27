import { Test, TestingModule } from '@nestjs/testing';
import { RecordDayLoveMomentController } from './record-day-love-moment.controller';
import { RecordDayLoveMomentService } from './record-day-love-moment.service';

describe('RecordDayLoveMomentController', () => {
  let controller: RecordDayLoveMomentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordDayLoveMomentController],
      providers: [RecordDayLoveMomentService],
    }).compile();

    controller = module.get<RecordDayLoveMomentController>(RecordDayLoveMomentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
