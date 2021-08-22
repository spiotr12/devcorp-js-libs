export type SortDirection = 'ASC' | 'DESC';

export interface DclSort {
  key: string;
  order: SortDirection;
}
