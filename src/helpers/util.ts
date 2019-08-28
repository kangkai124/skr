const toString = Object.prototype.toString

// TODO：is 的用法 类型谓词
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function _deepMerge(...objs: any[]): any {
  // TODO Object.create(null) vs {}  ??
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          // 如果某个key的值也是对象，那么这个值也要_deepMerge
          if (isPlainObject(result[key])) {
            result[key] = _deepMerge(result[key], val)
          } else {
            result[key] = _deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
