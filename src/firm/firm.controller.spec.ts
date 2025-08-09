import { Test, TestingModule } from '@nestjs/testing';
import { FirmController } from './firm.controller';

describe('FirmController', () => {
  let controller: FirmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirmController],
    }).compile();

    controller = module.get<FirmController>(FirmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
