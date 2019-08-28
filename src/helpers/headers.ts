import { isPlainObject, _deepMerge } from './util'
import { Methods } from '../types'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    if (
      name !== normalizedName &&
      name.toUpperCase() === normalizedName.toUpperCase()
    ) {
      headers[normalizedName] = headers[name]
      Reflect.deleteProperty(headers, name)
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })

  return parsed
}

/**
 *
 * @param headers
 * @param method
 *
 * @example
 *
 * headers: {
 *  common: {
 *    Accept: 'application/json, text/plain'
 *  },
 *  post: {
 *    'Content-Type': 'application/x-www-form-urlencoded'
 *  }
 * }
 *
 * ========>
 *
 * headers: {
 *   Accept: 'application/json, text/plain',
 *   'Content-Type': 'application/x-www-form-urlencoded'
 * }
 *
 */

export function flattenHeaders(headers: any, method: Methods): any {
  if (!headers) return headers

  headers = _deepMerge(headers.common, headers[method], headers)

  const methodToDelete = [
    'delete',
    'get',
    'head',
    'options',
    'post',
    'put',
    'patch',
    'common'
  ]

  methodToDelete.forEach(method => {
    // delete headers[method]
    Reflect.deleteProperty(headers, method)
  })

  return headers
}
