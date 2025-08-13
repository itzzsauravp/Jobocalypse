import { Test, TestingModule } from '@nestjs/testing';
import { FirmAuthController } from './firm-auth.controller';

describe('FirmAuthController', () => {
  let controller: FirmAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirmAuthController],
    }).compile();

    controller = module.get<FirmAuthController>(FirmAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
