import { Body, Controller, Post } from '@nestjs/common';
import { EsewaService } from './esewa.service';
import type { EsewaPaymentOption } from 'src/types/types.esewa';

@Controller('esewa')
export class EsewaController {
  constructor(private readonly esewaService: EsewaService) {}
  @Post('pay')
  async pay(@Body() body: EsewaPaymentOption) {
    const result = await this.esewaService.pay(body);
    return result;
  }
}
