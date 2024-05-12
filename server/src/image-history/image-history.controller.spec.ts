import { Test, TestingModule } from '@nestjs/testing';
import { ImageHistoryController } from './image-history.controller';
import { ImageHistoryService } from './image-history.service';

describe('ImageHistoryController', () => {
  let controller: ImageHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageHistoryController],
      providers: [ImageHistoryService],
    }).compile();

    controller = module.get<ImageHistoryController>(ImageHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
