import { isNotNil } from 'shared/lib/checkers'
import { isNotEmptyArray } from 'shared/lib/checkers/isNotEmptyArray'

export const findReport = (
  tree: any,
  targetReportId: number,
  path?: Array<string>
) => {
  const defaultPath = path || []
  // eslint-disable-next-line no-restricted-syntax
  for (const node of tree) {
    if (node.id === targetReportId) {
      return ({
        node, path: defaultPath
      })
    }
    if (node.reports || node.groups) {
      const desiredNode = findReport(node?.reports?.concat(node?.groups), targetReportId, defaultPath)
      if (desiredNode) {
        defaultPath.push(node.name)
        return findReport(node?.reports?.concat(node?.groups), targetReportId, defaultPath)
      }
    }
  }
  return false
}

export function filterReports(array, fn) {
  return array.reduce((prev, curr) => {
    const reports = filterReports(curr.reports || [], fn)
    const groups = filterReports(curr.groups || [], fn)
    if (fn(curr)) {
      prev.push(curr)
    } else if (reports.length !== 0 || groups.length !== 0) {
      prev.push({ ...curr, reports: reports.length !== 0 ? reports : [], groups: groups.length !== 0 ? groups : [] })
    }
  
    return prev
  }, [])
}

export function flatReports(arr: Array<any>) {
  const stack: Array<string> = []

  arr.forEach(el => {
    const children = [...el.reports || [], ...el.groups || []]
    if (isNotNil(children) && isNotEmptyArray(children)) {
      stack.push(el?.id ? el.id.toString() : el.name)
      stack.push(...flatReports(children))
    }
  })

  return stack
}