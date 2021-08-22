export type SortDirection = 'ASC' | 'DESC';

export interface ISort {
  key: string;
  order: SortDirection;
}
