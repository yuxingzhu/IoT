const _ = require('lodash')

export function setModel(_this, formName) {
  const model = {}
  _.forEach(_this[formName].formData, function(value) {
    _.set(model, value.name, value.value)
  })
  _this[formName].dynamicFormModel = Object.assign({}, _this[formName].dynamicFormModel, model)
}

export function fetchParentData(_this, dataName) {
  if (_this.$parent !== undefined) {
    if (_this.$parent[dataName] !== undefined) {
      return _this.$parent[dataName]
    } else {
      return fetchParentData(_this.$parent, dataName)
    }
  } else {
    return false
  }
}

export function dataFilter(data, queryString, valueKey) {
  let arr = []
  arr = _.filter(data, function(o) {
    if (valueKey === undefined) {
      if (_.includes(o.value, queryString)) {
        return o
      }
    } else {
      if (_.includes(o[valueKey], queryString)) {
        return o
      }
    }
  })
  return arr
}
