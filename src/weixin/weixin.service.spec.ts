import { Test, TestingModule } from '@nestjs/testing';
import { WeixinService } from './weixin.service';

describe('WeixinService', () => {
  let service: WeixinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeixinService],
    }).compile();

    service = module.get<WeixinService>(WeixinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
