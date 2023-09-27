import { Test, TestingModule } from '@nestjs/testing';
import { RecordDayCategoryService } from './record-day-category.service';

describe('RecordDayCategoryService', () => {
  let service: RecordDayCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordDayCategoryService],
    }).compile();

    service = module.get<RecordDayCategoryService>(RecordDayCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
