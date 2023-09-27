import { Test, TestingModule } from '@nestjs/testing';
import { RecordDayLoveMomentService } from './record-day-love-moment.service';

describe('RecordDayLoveMomentService', () => {
  let service: RecordDayLoveMomentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordDayLoveMomentService],
    }).compile();

    service = module.get<RecordDayLoveMomentService>(RecordDayLoveMomentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
