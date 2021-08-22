import { DclFilterOperator } from './filter-operator';
import { DclQueryBuilderOptions, DclQueryBuilder } from './query-builder';
import { DclQuery } from './query.interface';

describe('QueryBuilder', () => {
  let queryBuilder: DclQueryBuilder;

  beforeEach(() => {
    queryBuilder = new DclQueryBuilder();
  });

  describe('constructor', () => {
    it('should use default options', () => {
      // Arrange
      const options = {} as DclQueryBuilderOptions;

      // Act
      queryBuilder = new DclQueryBuilder(options);

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
      } as DclQueryBuilderOptions;

      // Act
      queryBuilder = new DclQueryBuilder(options);

      // Assert
      expect((queryBuilder as any).options).toEqual(options);
    });
  });

  describe('filterOperatorToSqlOperator', () => {
    it('should parse Equal operator and some value to "="', () => {
      // Arrange
      const opearator = DclFilterOperator.Equal;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('=');
    });

    it('should parse Equal operator and null value to "IS"', () => {
      // Arrange
      const opearator = DclFilterOperator.Equal;
      const value = null;

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('IS');
    });

    it('should parse NotEqual operator and some value to "<>"', () => {
      // Arrange
      const opearator = DclFilterOperator.NotEqual;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('<>');
    });

    it('should parse NotEqual operator and null value to "IS"', () => {
      // Arrange
      const opearator = DclFilterOperator.NotEqual;
      const value = null;

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('IS NOT');
    });

    it('should parse Contains operator and some value to "LIKE"', () => {
      // Arrange
      const opearator = DclFilterOperator.Contains;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('LIKE');
    });

    it('should parse GreaterThan operator and some value to ">"', () => {
      // Arrange
      const opearator = DclFilterOperator.GreaterThan;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('>');
    });

    it('should parse LessThan operator and some value to "<"', () => {
      // Arrange
      const opearator = DclFilterOperator.LessThan;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('<');
    });

    it('should parse GreaterThanOrEqual operator and some value to ">="', () => {
      // Arrange
      const opearator = DclFilterOperator.GreaterThanOrEqual;
      const value = 'something';

      // Act
      const result = queryBuilder.filterOperatorToSqlOperator(opearator, value);

      // Assert
      expect(result).toEqual('>=');
    });

    it('should parse LessThanOrEqual operator and some value to "<="', () => {
      // Arrange
      const opearator = DclFilterOperator.LessThanOrEqual;
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
      const query = {} as DclQuery;

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
        } as DclQuery;

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
        } as DclQuery;

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
        } as DclQuery;

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
        } as DclQuery;

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
        } as DclQuery;

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
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'something' },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.NotEqual, value: 'something' },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.GreaterThan, value: 'something' },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.LessThan, value: 'something' },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.GreaterThanOrEqual, value: 'something' },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.LessThanOrEqual, value: 'something' },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.Contains, value: 'something' },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.Equal, value: null },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.Equal, value: undefined },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 123 },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 123 },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 123.45 },
          ],
        } as DclQuery;

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
            { key: 'prop.nested', operator: DclFilterOperator.Equal, value: 'something' },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'something' },
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'other' },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'something' },
            { key: 'prop', operator: DclFilterOperator.NotEqual, value: 'other' },
          ],
        } as DclQuery;

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
            { key: 'prop', operator: DclFilterOperator.Equal, value: '' },
          ],
        });
      });

      it('should parse single string filter with Equal operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${DclFilterOperator.Equal}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with NotEqual operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${DclFilterOperator.NotEqual}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: DclFilterOperator.NotEqual, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with GreaterThan operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${DclFilterOperator.GreaterThan}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: DclFilterOperator.GreaterThan, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with LessThan operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${DclFilterOperator.LessThan}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: DclFilterOperator.LessThan, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with GreaterThanOrEqual operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${DclFilterOperator.GreaterThanOrEqual}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: DclFilterOperator.GreaterThanOrEqual, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with LessThanOrEqual operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${DclFilterOperator.LessThanOrEqual}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: DclFilterOperator.LessThanOrEqual, value: 'something' },
          ],
        });
      });

      it('should parse single string filter with Contains operator', () => {
        // Arrange
        const httpQueryParams = {
          'prop': `${DclFilterOperator.Contains}something`,
        };

        // Act
        const query = queryBuilder.httpQueryParamsToQuery(httpQueryParams);

        // Assert
        expect(query).toEqual({
          filterBy: [
            { key: 'prop', operator: DclFilterOperator.Contains, value: 'something' },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: true },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: false },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: null },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: undefined },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 123 },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 123.45 },
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
            { key: 'prop1', operator: DclFilterOperator.Equal, value: 123.45 },
            { key: 'prop2', operator: DclFilterOperator.Contains, value: 'something' },
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
            { key: 'prop.nested', operator: DclFilterOperator.Equal, value: 'something' },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'something,other' },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'something,@=other,different,!=nothing' },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'something' },
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'other' },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'something' },
            { key: 'prop', operator: DclFilterOperator.Contains, value: 'other' },
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'different' },
            { key: 'prop', operator: DclFilterOperator.NotEqual, value: 'nothing' },
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
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'something' },
            { key: 'prop', operator: DclFilterOperator.Equal, value: 'other' },
            { key: 'prop', operator: DclFilterOperator.Contains, value: 'different' },
          ],
        });
      });
    });
  });
});
