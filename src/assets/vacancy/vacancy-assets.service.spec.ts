import { Test, TestingModule } from '@nestjs/testing';
import { VacancyAssetsService } from './vacancy-assets.service';

describe('VacancyAssetsService', () => {
  let service: VacancyAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacancyAssetsService],
    }).compile();

    service = module.get<VacancyAssetsService>(VacancyAssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
