import { FilterOperator } from './filter-operator';
import { IFilter } from './filter.interface';
import { IQuery } from './query.interface';
import { ISort } from './sort.interface';

export interface IHttpQueryParams {
  [key: string]: any;
}

export interface IQueryBuilderOptions {
  pageParamKey: string;
  limitParamKey: string;
  sortParamKey: string;
}

const DEFAULT_OPTIONS: IQueryBuilderOptions = {
  pageParamKey: '_page',
  limitParamKey: '_limit',
  sortParamKey: '_sort',
};

const POSSIBLE_OPERATORS = [
  FilterOperator.Equal,
  FilterOperator.NotEqual,
  FilterOperator.GreaterThan,
  FilterOperator.LessThan,
  FilterOperator.GreaterThanOrEqual,
  FilterOperator.LessThanOrEqual,
  FilterOperator.Contains,
].sort((a, b) => b.length - a.length);

export class QueryBuilder {

  private readonly options: IQueryBuilderOptions;

  constructor(options: Partial<IQueryBuilderOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public filterOperatorToSqlOperator(operator: FilterOperator | string, value: string | number | null): string {
    if (operator === FilterOperator.Equal && value === null) {
      return `IS`;
    }

    if (operator === FilterOperator.NotEqual && value === null) {
      return `IS NOT`;
    }

    if (operator === FilterOperator.Equal) {
      return `=`;
    }

    if (operator === FilterOperator.NotEqual) {
      return `<>`;
    }

    if (operator === FilterOperator.Contains) {
      return `LIKE`;
    }

    const otherOperators = [
      FilterOperator.GreaterThan,
      FilterOperator.LessThan,
      FilterOperator.GreaterThanOrEqual,
      FilterOperator.LessThanOrEqual,
    ] as string[];

    if (otherOperators.includes(operator)) {
      return `${operator}`;
    }

    throw new Error('Operator not recognized');
  }

  public filterOperatorToMongoOperator(operator: FilterOperator | string, value: string | number | null): string {
    throw new Error('Not Implemented');
  }

  public queryToHttpQueryParams(query: IQuery): IHttpQueryParams {
    const params: IHttpQueryParams = {};

    // Pagination
    if (query.page) {
      params[this.options.pageParamKey] = query.page;
    }
    if (query.limit) {
      params[this.options.limitParamKey] = query.limit;
    }

    // Sort
    if (query.sortBy && query.sortBy.length > 0) {
      params[this.options.sortParamKey] = query.sortBy
        .map(sort => sort.order === 'DESC' ? `-${sort.key}` : sort.key)
        .join(',');
    }

    // Filter
    if (query.filterBy && query.filterBy.length > 0) {
      query.filterBy.forEach((filter) => {
        if (!params[filter.key]) {
          // Allows arrays to be passed, like date (range)
          params[filter.key] = [];
        }
        params[filter.key].push(`${filter.operator}${filter.value}`);
      });
    }

    return params;
  }

  public httpQueryParamsToQuery(httpQueryParams: { [key: string]: string },
                                options: {
                                  defaultPage?: number, defaultLimit?: number,
                                  allowComaSeparatedArrays?: boolean,
                                } = {}): IQuery {
    const query: IQuery = {};

    const page = +httpQueryParams._page || options?.defaultPage;
    if (page !== undefined) {
      query.page = page;
    }

    const limit = +httpQueryParams._limit || options?.defaultLimit;
    if (limit !== undefined) {
      query.limit = limit;
    }

    const sortBy = this.parseSortHttpQueryParams(httpQueryParams._sort);
    if (sortBy.length) {
      query.sortBy = sortBy;
    }

    const filterBy = this.parseFilterHttpQueryParams(httpQueryParams, options);
    if (filterBy.length) {
      query.filterBy = filterBy;
    }

    return query;
  }

  private parseSortHttpQueryParams(sort: string): ISort[] {
    if (!sort || sort.length === 0) {
      return [];
    }

    const sorts = sort.split(',');

    const parsedSorts: ISort[] = [];

    sorts.forEach((s) => {
      if (s.startsWith('-')) {
        parsedSorts.push({ key: s.substring(1), order: 'DESC' });
      } else {
        parsedSorts.push({ key: s, order: 'ASC' });
      }
    });

    return parsedSorts;
  }

  private parseFilterHttpQueryParams(httpQueryParams: { [key: string]: string },
                                     options: {
                                       allowComaSeparatedArrays?: boolean
                                     } = {}): IFilter[] {
    const keyOperators = [this.options.pageParamKey, this.options.limitParamKey, this.options.sortParamKey];
    const filterKeys = Object.keys(httpQueryParams).filter((key) => !keyOperators.includes(key));

    if (filterKeys.length === 0) {
      return [];
    }

    const filters: IFilter[] = [];

    filterKeys.forEach((key) => {
      const filterStr = httpQueryParams[key];
      if (Array.isArray(filterStr)) {
        filterStr.forEach((str) => filters.push(this.parseFilterStr(key, str)));
      } else {
        // Case when array query params appear as string with coma separate elements
        const match = filterStr.match(/,[=:!<>@]*/g);
        if (options.allowComaSeparatedArrays && match && match.length > 0) {
          filterStr.split(',')
            .forEach((str) => filters.push(this.parseFilterStr(key, str)));
        } else {
          filters.push(this.parseFilterStr(key, filterStr));
        }
      }
    });

    return filters;
  }

  private parseFilterStr(key: string, filterStr: string): IFilter {
    let operator = POSSIBLE_OPERATORS.find((op) => filterStr.trim().startsWith(op));

    if (!operator && !!filterStr.match(/^([^a-zA-Z0-9])+/g)) {
      throw new Error('Operator not recognized');
    }

    let value: any;
    // Default operator
    // In case no operator is provided
    if (operator) {
      value = filterStr.substring(operator.length);
    } else {
      operator = FilterOperator.Equal;
      value = filterStr;
    }

    // Parse value to something more meaningful
    if ((value as string).toLowerCase() === 'true') {
      // Parse boolean
      value = true;
    } else if ((value as string).toLowerCase() === 'false') {
      // Parse boolean
      value = false;
    } else if ((value as string).toLowerCase() === 'null') {
      // Parse null
      value = null;
    } else if (value.toLowerCase() === 'undefined') {
      // Parse undefined
      value = undefined;
    } else if (!isNaN(parseFloat(value as string))) {
      // Parse number
      value = parseFloat(value as string);
    }

    return {
      key,
      operator,
      value,
    };
  }
}
