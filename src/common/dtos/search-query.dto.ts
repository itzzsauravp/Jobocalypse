import { IsString } from 'class-validator';

export class SearchQuery {
  @IsString()
  q: string;
}
