import { FilterOperator } from './filter-operator';


export interface IFilter {
  key: string;
  operator: FilterOperator;
  value: string | number | boolean | null | undefined;
}
