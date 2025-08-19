import { Test, TestingModule } from '@nestjs/testing';
import { EsewaService } from './esewa.service';

describe('EsewaService', () => {
  let service: EsewaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsewaService],
    }).compile();

    service = module.get<EsewaService>(EsewaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
