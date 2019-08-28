import { AxiosRequestConfig } from '../types'
import { isPlainObject, _deepMerge } from '../helpers/util'

// strats是个mapping，映射不同的参数对应的merge方式
const strats = Object.create(null)

function defaultMerge(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Merge(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') return val2
}

function deepMerge(val1: any, val2: any): any {
  console.log(val1, val2)
  if (isPlainObject(val2)) {
    return _deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return _deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const KeysFromVal2 = ['url', 'params', 'data']

const keysDeepMerge = ['headers']

KeysFromVal2.forEach(key => {
  strats[key] = fromVal2Merge
})

keysDeepMerge.forEach(key => {
  strats[key] = deepMerge
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) config2 = {}

  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultMerge
    // 虽然上面判断了config2为空时，做了赋值，但是在这个函数体内部，
    // ts无法推断出config2是否传值，所以使用！断言
    // 或者在函数参数里给config2一个默认值
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
