import { FilterOperator } from './filter-operator';
import { IQueryBuilderOptions, QueryBuilder } from './query-builder';
import { IQuery } from './query.interface';

describe('QueryBuilder', () => {
  let queryBuilder: QueryBuilder;

  beforeEach(() => {
    queryBuilder = new QueryBuilder();
  });

  describe('constructor', () => {
    it('should use default options', () => {
      // Arrange
      const options = {} as IQueryBuilderOptions;

      // Act
      queryBuilder = new QueryBuilder(options);

      // Assert
      expect((queryBuilder as any).options).toEqual({
        pageParamKey: '_page',
        limitParamKey: '_limit',
        sortParamKey: '_sort',
      });
    });

    it('should use options', () => {
      // Arrange
      const options = {
        pageParamKey: 'custom-page',
        limitParamKey: 'limit-page',
        sortParamKey: 'sort-page',
      } as IQueryBuilderOptions;

      // Act
      queryBuilder = new QueryBuilder(options);

      // Assert
      expect((queryBuilder as any).options).toEqual(options);
    });
  });

  describe('filterOperatorToSqlOperator', () => {
    it('should parse Equal operator and some value to "="', () => {
      // Arrange
      const opearator = FilterOperator.Equal;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('=');
    });

    it('should parse Equal operator and null value to "IS"', () => {
      // Arrange
      const opearator = FilterOperator.Equal;
      const value = null;

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('IS');
    });

    it('should parse NotEqual operator and some value to "<>"', () => {
      // Arrange
      const opearator = FilterOperator.NotEqual;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('<>');
    });

    it('should parse NotEqual operator and null value to "IS"', () => {
      // Arrange
      const opearator = FilterOperator.NotEqual;
      const value = null;

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('IS NOT');
    });

    it('should parse Contains operator and some value to "LIKE"', () => {
      // Arrange
      const opearator = FilterOperator.Contains;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('LIKE');
    });

    it('should parse GreaterThan operator and some value to ">"', () => {
      // Arrange
      const opearator = FilterOperator.GreaterThan;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('>');
    });

    it('should parse LessThan operator and some value to "<"', () => {
      // Arrange
      const opearator = FilterOperator.LessThan;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('<');
    });

    it('should parse GreaterThanOrEqual operator and some value to ">="', () => {
      // Arrange
      const opearator = FilterOperator.GreaterThanOrEqual;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('>=');
    });

    it('should parse LessThanOrEqual operator and some value to "<="', () => {
      // Arrange
      const opearator = FilterOperator.LessThanOrEqual;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('<=');
    });

    it('should throw error for unknown operator', () => {
      // Arrange
      const opearator = '%@#!';
      const value = 'something';

      // Act
      const throwFn = () => {
        queryBuilder.filterOperatorToSqlOperator(opearator, value);
      };

      // Assert
      expect(throwFn).toThrowError('Operator not recognized');
    });
  });

  describe('filterOperatorToMongoOperator', () => {
    it('should throw Not Implemented error', () => {
      // Arrange

      // Act
      const throwFn = () => {
        queryBuilder.filterOperatorToMongoOperator('', '');
      };

      // Assert
      expect(throwFn).toThrowError('Not Implemented');
    });
  });

  describe('queryToHttpQueryParams', () => {
    it('should return empty object', () => {
      // Arrange
      const query = {} as IQuery;

      // Act
      const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

      // Assert
      expect(httpQueryParams).toEqual({});
    });

    describe('pagination', () => {
      it('should parse page', () => {
        // Arrange
        const query = {
          page: 12,
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          '_page': query.page,
        });
      });

      it('should parse limit', () => {
        // Arrange
        const query = {
          limit: 100,
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          '_limit': query.limit,
        });
      });
    });

    describe('sorting', () => {
      it('should parse single sort ASC by default', () => {
        // Arrange
        const query = {
          sortBy: [
            { key: 'propKey' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          '_sort': 'propKey',
        });
      });

      it('should parse single sort ASC', () => {
        // Arrange
        const query = {
          sortBy: [
            { key: 'propKey', order: 'ASC' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          '_sort': 'propKey',
        });
      });

      it('should parse single sort DESC', () => {
        // Arrange
        const query = {
          sortBy: [
            { key: 'propKey', order: 'DESC' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          '_sort': '-propKey',
        });
      });

      it('should parse multiple sort', () => {
        // Arrange
        const query = {
          sortBy: [
            { key: 'propKey1', order: 'ASC' },
            { key: 'propKey2' },
            { key: 'propKey3', order: 'DESC' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          '_sort': 'propKey1,propKey2,-propKey3',
        });
      });
    });

    describe('filtering', () => {
      it('should parse single filter with Equal operator', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 'something' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['==something'],
        });
      });

      it('should parse single filter with NotEqual operator', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.NotEqual, value: 'something' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['!=something'],
        });
      });

      it('should parse single filter with GreaterThan operator', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.GreaterThan, value: 'something' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['>something'],
        });
      });

      it('should parse single filter with LessThan operator', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.LessThan, value: 'something' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['<something'],
        });
      });

      it('should parse single filter with GreaterThanOrEqual operator', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.GreaterThanOrEqual, value: 'something' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['>=something'],
        });
      });

      it('should parse single filter with LessThanOrEqual operator', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.LessThanOrEqual, value: 'something' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['<=something'],
        });
      });

      it('should parse single filter with Contains operator', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.Contains, value: 'something' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['@=something'],
        });
      });

      it('should parse single filter with null value', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: null },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['==null'],
        });
      });

      it('should parse single filter with undefined value', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: undefined },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['==undefined'],
        });
      });

      it('should parse single filter with numeric value', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 123 },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['==123'],
        });
      });

      it('should parse single filter with integer value', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 123 },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['==123'],
        });
      });

      it('should parse single filter with flaot value', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 123.45 },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['==123.45'],
        });
      });

      it('should parse single filter nested prop', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop.nested', operator: FilterOperator.Equal, value: 'something' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop.nested': ['==something'],
        });
      });

      it('should parse multiple filters on same prop', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 'something' },
            { key: 'prop', operator: FilterOperator.Equal, value: 'other' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['==something', '==other'],
        });
      });

      it('should parse multiple filters on same prop with different operators', () => {
        // Arrange
        const query = {
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 'something' },
            { key: 'prop', operator: FilterOperator.NotEqual, value: 'other' },
          ],
        } as IQuery;

        // Act
        const httpQueryParams = queryBuilder.queryToHttpQueryParams(query);

        // Assert
        expect(httpQueryParams).toEqual({
          'prop': ['==something', '!=other'],
        });
      });
    });
  });

  describe('httpQueryParamsToQuery', () => {
    it('should parse empty queryParams', () => {
      // Arrange
      const httpQueryParams = {};

      // Act
      const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

      // Assert
      expect(query).toEqual({});
    });

    describe('pagination', () => {
      it('should parse _page', () => {
        // Arrange
        const httpQueryParams = {
          '_page': '2',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          page: 2,
        });
      });

      it('should use page default', () => {
        // Arrange
        const httpQueryParams = {};
        const options = {
          defaultPage: 0,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams, options);

        // Assert
        expect(query).toEqual({
          page: 0,
        });
      });

      it('should parse _limit', () => {
        // Arrange
        const httpQueryParams = {
          '_limit': '120',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          limit: 120,
        });
      });

      it('should use limit default', () => {
        // Arrange
        const httpQueryParams = {};
        const options = {
          defaultLimit: 50,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams, options);

        // Assert
        expect(query).toEqual({
          limit: 50,
        });
      });
    });

    describe('sorting', () => {
      it('should parse empty sort', () => {
        // Arrange
        const httpQueryParams = {
          '_sort': '',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({});
      });

      it('should parse single sort ASC', () => {
        // Arrange
        const httpQueryParams = {
          '_sort': 'prop',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          sortBy: [
            { key: 'prop', order: 'ASC' },
          ],
        });
      });

      it('should parse single sort DESC', () => {
        // Arrange
        const httpQueryParams = {
          '_sort': '-prop',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          sortBy: [
            { key: 'prop', order: 'DESC' },
          ],
        });
      });

      it('should parse multiple sorts', () => {
        // Arrange
        const httpQueryParams = {
          '_sort': 'prop1,-prop2,prop3',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          sortBy: [
            { key: 'prop1', order: 'ASC' },
            { key: 'prop2', order: 'DESC' },
            { key: 'prop3', order: 'ASC' },
          ],
        });
      });
    });

    describe('filtering', () => {
      it('should parse no filters', () => {
        // Arrange
        const httpQueryParams = {};

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({});
      });

      it('should parse single empty filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': '',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: '' },
          ],
        });
      });

      it('should parse single string filter with Equal operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${FilterOperator.Equal}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with NotEqual operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${FilterOperator.NotEqual}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.NotEqual, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with GreaterThan operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${FilterOperator.GreaterThan}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.GreaterThan, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with LessThan operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${FilterOperator.LessThan}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.LessThan, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with GreaterThanOrEqual operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${FilterOperator.GreaterThanOrEqual}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.GreaterThanOrEqual, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with LessThanOrEqual operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${FilterOperator.LessThanOrEqual}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.LessThanOrEqual, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with Contains operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${FilterOperator.Contains}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Contains, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with unknown operator #1', () => {
        // Arrange
        const httpQueryParams = {
          'prop': '@#!$something',
        };

        // Act
        const throwFn = () => {
          queryBuilder.httpQueryParamsToQuery(httpQueryParams);
        };

        // Assert
        expect(throwFn).toThrowError('Operator not recognized');
      });

      it('should parse single string filter with unknown operator #2', () => {
        // Arrange
        const httpQueryParams = {
          'prop': '_@#!$something',
        };

        // Act
        const throwFn = () => {
          queryBuilder.httpQueryParamsToQuery(httpQueryParams);
        };

        // Assert
        expect(throwFn).toThrowError('Operator not recognized');
      });

      it('should parse single "true" value filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': 'true',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: true },
          ],
        });
      });

      it('should parse single "false" value filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': 'false',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: false },
          ],
        });
      });

      it('should parse single "null" value filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': 'null',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: null },
          ],
        });
      });

      it('should parse single "undefined" value filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': 'undefined',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: undefined },
          ],
        });
      });

      it('should parse single integer value filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': '123',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 123 },
          ],
        });
      });

      it('should parse single float value filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': '123.45',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 123.45 },
          ],
        });
      });

      it('should parse multiple filters', () => {
        // Arrange
        const httpQueryParams = {
          'prop1': '123.45',
          'prop2': '@=something',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop1', operator: FilterOperator.Equal, value: 123.45 },
            { key: 'prop2', operator: FilterOperator.Contains, value: 'something' },
          ],
        });
      });

      it('should parse single nested prop filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop.nested': 'something',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop.nested', operator: FilterOperator.Equal, value: 'something' },
          ],
        });
      });

      it('should parse single value with comma filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': 'something,other',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 'something,other' },
          ],
        });
      });

      it('should parse single value with comma filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': 'something,@=other,different,!=nothing',
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 'something,@=other,different,!=nothing' },
          ],
        });
      });

      it('should parse single coma separated array filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': 'something,other',
        };
        const options = {
          allowComaSeparatedArrays: true,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams, options);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 'something' },
            { key: 'prop', operator: FilterOperator.Equal, value: 'other' },
          ],
        });
      });

      it('should parse single coma separated array filter with operators', () => {
        // Arrange
        const httpQueryParams = {
          'prop': 'something,@=other,different,!=nothing',
        };
        const options = {
          allowComaSeparatedArrays: true,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams, options);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 'something' },
            { key: 'prop', operator: FilterOperator.Contains, value: 'other' },
            { key: 'prop', operator: FilterOperator.Equal, value: 'different' },
            { key: 'prop', operator: FilterOperator.NotEqual, value: 'nothing' },
          ],
        });
      });

      it('should parse single array filter', () => {
        // Arrange
        const httpQueryParams = {
          'prop': ['something', 'other', '@=different'],
        } as any;

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: FilterOperator.Equal, value: 'something' },
            { key: 'prop', operator: FilterOperator.Equal, value: 'other' },
            { key: 'prop', operator: FilterOperator.Contains, value: 'different' },
          ],
        });
      });
    });
  });
});
