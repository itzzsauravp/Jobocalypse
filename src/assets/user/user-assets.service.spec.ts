import { Test, TestingModule } from '@nestjs/testing';
import { UserAssetsService } from './user-assets.service';

describe('UserAssetsService', () => {
  let service: UserAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAssetsService],
    }).compile();

    service = module.get<UserAssetsService>(UserAssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
