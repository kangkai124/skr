import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) return data

  // 如果不是数组，将其转为数组，便于之后逻辑统一
  if (!Array.isArray(fns)) fns = [fns]

  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
