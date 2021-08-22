import { DclFilter } from './filter.interface';
import { DclSort } from './sort.interface';

export interface DclQuery {
  limit?: number;
  page?: number;
  sortBy?: DclSort[];
  filterBy?: DclFilter[];
}
