import { Test, TestingModule } from '@nestjs/testing';
import { RecordDayCategoryController } from './record-day-category.controller';
import { RecordDayCategoryService } from './record-day-category.service';

describe('RecordDayCategoryController', () => {
  let controller: RecordDayCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordDayCategoryController],
      providers: [RecordDayCategoryService],
    }).compile();

    controller = module.get<RecordDayCategoryController>(RecordDayCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
