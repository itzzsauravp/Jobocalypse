import { Test, TestingModule } from '@nestjs/testing';
import { EsewaController } from './esewa.controller';

describe('EsewaController', () => {
  let controller: EsewaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EsewaController],
    }).compile();

    controller = module.get<EsewaController>(EsewaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
