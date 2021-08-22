import { DclFilterOperator } from './filter-operator';


export interface DclFilter {
  key: string;
  operator: DclFilterOperator;
  value: string | number | boolean | null | undefined;
}
