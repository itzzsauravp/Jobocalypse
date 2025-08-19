import { Request } from 'express';
import { BusinessService } from '../business.service';
import { BusinessOwnerGuard } from './business-owner.guard';
import { ExecutionContext } from '@nestjs/common';

describe('BusinessOwnerGuard', () => {
  let guard: BusinessOwnerGuard;
  let mockBusinessService: Partial<BusinessService>;
  const mockDatabase = [
    { userID: '1', businessID: 10 },
    { userID: '2', businessID: undefined },
    { userID: '3', businessID: 30 },
  ];

  beforeEach(() => {
    mockBusinessService = {
      findByOwnerID: jest.fn(),
    };
    guard = new BusinessOwnerGuard(mockBusinessService as BusinessService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  for (const data of mockDatabase) {
    it(`should ${data.businessID ? 'allow' : 'deny'} acess for userID: ${data.userID}`, async () => {
      const request: Partial<Request> = {
        entity: {
          email: 'test@gmail.com',
          id: data.userID,
          type: 'user',
        },
      };
      const context: ExecutionContext = {
        switchToHttp: () => ({ getRequest: () => request }),
      };

      (mockBusinessService.findByOwnerID as jest.Mock).mockResolvedValue(
        data.businessID ? { id: data.businessID } : null,
      );

      const result = await guard.canActivate(context);
      if (data.businessID) {
        expect(result).toBe(true);
        expect(request.businessID).toBe(data.businessID);
      } else {
        expect(result).toBe(false);
        expect(request.businessID).toBe(data.businessID);
      }
      expect(mockBusinessService.findByOwnerID).toHaveBeenCalledWith(
        data.userID,
      );
    });
  }
});
