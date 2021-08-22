import { ISort } from './sort.interface';
import { IFilter } from './filter.interface';

export interface IQuery {
  limit?: number;
  page?: number;
  sortBy?: ISort[];
  filterBy?: IFilter[];
}
