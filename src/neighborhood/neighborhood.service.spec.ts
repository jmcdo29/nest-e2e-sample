import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodService } from './neighborhood.service';

describe('NeighborhoodService', () => {
  let service: NeighborhoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NeighborhoodService],
    }).compile();

    service = module.get<NeighborhoodService>(NeighborhoodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
