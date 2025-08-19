import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BusinessAssetsService } from 'src/assets/business/business-assets.service';
import { CacheService } from 'src/cache/cache.service';
import { AdminQueryFilters } from 'src/common/dtos/pagination.dto';
import { ADMIN_ALL_BUSINESSES_CACHE } from 'src/cache/cache.constants';
import { PaginatedData } from 'src/common/interfaces/paginated-data.interface';

describe('BusinessService', () => {
  let service: BusinessService;
  let module: TestingModule;
  let cacheService: CacheService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        BusinessService,
        {
          provide: PrismaService,
          useValue: {
            business: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
        {
          provide: CloudinaryService,
          useValue: {},
        },
        {
          provide: BusinessAssetsService,
          useValue: {},
        },
        {
          provide: CacheService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();
  });

  beforeEach(() => {
    service = module.get<BusinessService>(BusinessService);
    cacheService = module.get<CacheService>(CacheService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('case: Get findAll from cache if cache exists', async () => {
    const dto: AdminQueryFilters = { page: 1, limit: 5 };
    const cachedData = [{ id: 1, name: 'Business 1' }];
    const getSpy = jest
      .spyOn(cacheService, 'get')
      .mockResolvedValue(cachedData);
    jest.spyOn(prismaService.business, 'count').mockResolvedValue(1);
    const findManySpy = jest.spyOn(prismaService.business, 'findMany');
    const mockResult: PaginatedData<typeof cachedData> = {
      data: cachedData,
      currentPage: 1,
      totalCount: 1,
      totalPages: 1,
    };
    const result = await service.findAll(dto);
    expect(result).toEqual(mockResult);
    expect(getSpy).toHaveBeenCalledWith(
      `${ADMIN_ALL_BUSINESSES_CACHE}:${JSON.stringify(dto)}`,
    );
    expect(findManySpy).not.toHaveBeenCalled();
  });

  it('case: Get findAll from db and set cache, if cache doesnot exist', async () => {
    const dto: AdminQueryFilters = { page: 1, limit: 5 };
    const dbData = [{ id: 1, name: 'Business 1' }];
    const mockResult: PaginatedData<typeof dbData> = {
      data: dbData,
      totalCount: 1,
      currentPage: 1,
      totalPages: 1,
    };
    const setSpy = jest.spyOn(cacheService, 'set');
    const findManySpy = jest
      .spyOn(prismaService.business, 'findMany')
      .mockResolvedValue(dbData);
    jest.spyOn(prismaService.business, 'count').mockResolvedValue(1);
    const result = await service.findAll(dto);
    expect(result).toStrictEqual(mockResult);
    expect(setSpy).toHaveBeenCalledWith(
      `${ADMIN_ALL_BUSINESSES_CACHE}:${JSON.stringify(dto)}`,
      dbData,
    );
    expect(findManySpy).toHaveBeenCalled();
  });
});
