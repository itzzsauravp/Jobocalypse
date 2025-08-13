import { Test, TestingModule } from '@nestjs/testing';
import { FirmAuthService } from './firm-auth.service';

describe('FirmAuthService', () => {
  let service: FirmAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirmAuthService],
    }).compile();

    service = module.get<FirmAuthService>(FirmAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
