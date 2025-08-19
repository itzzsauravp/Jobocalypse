import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { createHmac } from 'crypto';
import { firstValueFrom } from 'rxjs';
import {
  EsewaApiResponse,
  type EsewaPaymentOption,
  type EsewaPaymentPayload,
  type EsewaServiceOption,
} from 'src/types/types.esewa';

@Injectable()
export class EsewaService {
  private failure_url: string;
  private success_url: string;
  private signed_field_names: string;
  private secret: string;
  private action: string;
  private product_code: string;
  private urls = {
    prod: 'https://epay.esewa.com.np/api/epay/main/v2/form',
    dev: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  };
  constructor(
    options: EsewaServiceOption,
    private readonly httpService: HttpService,
  ) {
    this.failure_url = options.failure_url;
    this.success_url = options.success_url;
    this.signed_field_names = 'total_amount,transaction_uuid,product_code';
    this.secret = '8gBm/:&EnhH.1/q';
    this.action =
      options.environment === 'dev' ? this.urls.dev : this.urls.prod;
    this.product_code = 'EPAYTEST';
  }

  generateTotalAmount(...args: any): string {
    let total_amount: number = 0;
    for (const arg of args) {
      try {
        total_amount += Number(arg);
      } catch {
        throw new Error(`Arg: ${arg} is not a valid number`);
      }
    }
    return `${total_amount}`;
  }

  generateBase64Hash(message: string, secret: string) {
    return createHmac('sha256', secret).update(message).digest('base64');
  }

  async pay(options: EsewaPaymentOption) {
    try {
      const action = this.action;
      const total_amount = this.generateTotalAmount(
        options.amount,
        options.product_delivery_charge,
        options.product_service_charge,
        options.tax_amount,
      );

      const messageToGenerateSignatureFor = `total_amount=${total_amount},transaction_uuid=${options.transaction_uuid},product_code=${this.product_code}`;
      const signature = this.generateBase64Hash(
        messageToGenerateSignatureFor,
        this.secret,
      );

      const payload: EsewaPaymentPayload = {
        ...options,
        failure_url: this.failure_url,
        product_code: this.product_code,
        signature,
        signed_field_names: this.signed_field_names,
        success_url: this.success_url,
        total_amount,
      };
      const response = await firstValueFrom(
        this.httpService.post<EsewaApiResponse, EsewaPaymentOption>(
          action,
          payload,
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(error.message, error.status as number);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
