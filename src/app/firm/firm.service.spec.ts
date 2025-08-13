import { Test, TestingModule } from '@nestjs/testing';
import { FirmService } from './firm.service';

describe('FirmService', () => {
  let service: FirmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirmService],
    }).compile();

    service = module.get<FirmService>(FirmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
