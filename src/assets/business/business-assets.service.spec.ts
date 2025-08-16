import { Test, TestingModule } from '@nestjs/testing';
import { BusinessAssetsService } from './business-assets.service';

describe('BusinessAssetsService', () => {
  let service: BusinessAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessAssetsService],
    }).compile();

    service = module.get<BusinessAssetsService>(BusinessAssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
