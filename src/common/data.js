/**
 * Operators used for quering data
 */
 const defaultOperator = {
  text: 'Default',
  value: ''
},
equalOperator = {
  text: 'Equal',
  value: '$eq'
},
regexOperator = {
  text: 'Regex',
  value: '$regex'
},
greaterThanOperator = {
  text: 'Greater than',
  value: '$gt'
},
greaterThanEqualOperator = {
  text: 'Greater than or equal',
  value: '$gte'
},
lessThanOperator = {
  text: 'Less than',
  value: '$lt'
},
lessThanEqualOperator = {
  text: 'Less than or equal',
  value: '$lte'
},
notEqualsOperator = {
  text: 'Not equal',
  value: '$ne'
}
export const DATA_TYPES = ["String", "Numeric", "ObjectId"]
export const STRING_COMPARISON_OPERATORS = [
defaultOperator,
equalOperator,
regexOperator,
greaterThanOperator,
greaterThanEqualOperator,
lessThanOperator,
lessThanEqualOperator,
notEqualsOperator
]
export const NUMERICAL_COMPARISON_OPERATORS = [
defaultOperator,
equalOperator,
regexOperator,
greaterThanOperator,
greaterThanEqualOperator,
lessThanOperator,
lessThanEqualOperator,
notEqualsOperator
]
export const OBJECTID_COMPARISON_OPERATORS = [
defaultOperator,
equalOperator,
notEqualsOperator
]
export const QUERY_METHOD_CATEGORY = [
// {
//   label: 'Insert',
//   active: false,
//   value: 'insert',
//   color: 'primary'
// },
{
  label: 'Update',
  active: false,
  value: 'update',
  color: 'primary',
  projection: false
}, {
  label: 'Find',
  active: true,
  value: 'find',
  color: 'primary',
  projection: true
},
// {
//   label: 'Delete',
//   active: false,
//   value: 'delete',
//   color: 'primary'
// },
// {
//   label: 'Aggregate',
//   active: false,
//   value: 'aggregate',
//   color: 'primary'
// }
]
export const QUERY_METHODS_OPTIONS = {
  find: [{
    label: 'Find',
    value: 'find',
    default: false,
    isLogicalOperatorRequred: true,
  }, {
    label: 'FindOne',
    value: 'findOne',
    default: false,
    isLogicalOperatorRequred: true
  }],
  update: [{
      label: 'Update',
      value: 'update',
      default: false,
      isLogicalOperatorRequred: true,
    }, {
      label: 'UpdateOne',
      value: 'updateOne',
      default: false,
      isLogicalOperatorRequred: true,
    }, {
      label: 'UpdateMany',
      value: 'updateMany',
      default: false,
      isLogicalOperatorRequred: true,
    },
    // {
    //   label: 'FindByIdAndUpdate',
    //   value: 'findByIdAndUpdate',
    //   default: false,
    //   isLogicalOperatorRequred: false
    // }, 
    {
      label: 'FindOneAndUpdate',
      value: 'findOneAndUpdate',
      default: false,
      isLogicalOperatorRequred: true
    }
  ],
  insert: [
    //   {
    //   label: 'InsertMany',
    //   value: 'insertMany',
    //   default: false,
    //   isLogicalOperatorRequred: false
    // }, {
    //   label: 'Create',
    //   value: 'create',
    //   default: false,
    //   isLogicalOperatorRequred: false
    // }
  ],
  delete: [],
  aggregate: []
}

export const CURSOR_METHODS = [
  {
    text: 'Pretty',
    value: 'pretty',
    active: false
  }, {
    text: 'Limit',
    value: 'limit',
    active: false
  }, {
    text: 'Skip',
    value: 'skip',
    active: false
  }, {
    text: 'Sort',
    value: 'sort',
    active: false
  }, {
    text: 'Count',
    value: 'count',
    active: false
  }
]