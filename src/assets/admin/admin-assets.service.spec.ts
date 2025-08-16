import { Test, TestingModule } from '@nestjs/testing';
import { AdminAssetsService } from './admin-assets.service';

describe('AdminAssetsService', () => {
  let service: AdminAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminAssetsService],
    }).compile();

    service = module.get<AdminAssetsService>(AdminAssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
