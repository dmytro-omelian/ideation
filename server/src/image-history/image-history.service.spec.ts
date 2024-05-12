import { Test, TestingModule } from '@nestjs/testing';
import { ImageHistoryService } from './image-history.service';

describe('ImageHistoryService', () => {
  let service: ImageHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageHistoryService],
    }).compile();

    service = module.get<ImageHistoryService>(ImageHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
