import React, { useEffect } from 'react'
import { ListProps } from 'features/analytics/reports/lib/types'
import { TreeView } from '@mui/x-tree-view/TreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { isNotEmptyArray } from 'shared/lib/checkers/isNotEmptyArray'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { isNotNil } from 'shared/lib/checkers'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { highlight } from 'shared/lib/transform/highlightText'

import { filterReports, findReport, flatReports } from '../../lib/findReports'
import { TreeViewWrapper } from '../styled'


const checkElement = (el) => (isNotNil(el) && isNotEmptyArray(el))

export const ReportsFolder = ({ data, report, setReport, changeReportsParams, searchString }: ListProps) => {

  useEffect(() => {
    if (searchString.length !== 0) {
      setReport(prevState => ({
        ...prevState,
        path: flatReports(filteredReports)
      }))
    } else {
      setReport(prevState => ({
        ...prevState,
        path: []
      }))
    }
  },[searchString])

  useEffect(() => {
    highlight(searchString,'MuiTreeItem-label')
  }, [report.path])

  const handleNodeSelect = (_, nodeId: string | number) => {
    if (Number.isInteger(Number(nodeId))) {
      const rep = findReport(data, Number(nodeId))

      setReport(prevState => ({
        ...prevState,
        reportData: rep.node
      }))
      changeReportsParams({ reportId: rep.node.id })
    }
  }

  const handleNodeToggle = (_, nodeIds) => {
    setReport(prevState => ({
      ...prevState,
      path: nodeIds
    }))
  }

  const filteredReports = filterReports(data,
    ({ name }) => searchString !== '' ? name.toLowerCase().includes(searchString.toLowerCase()) : true)

  return (
    <TreeViewWrapper>
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        selected={report.reportData?.id.toString() || ''}
        expanded={report?.path || []}
        onNodeToggle={handleNodeToggle}
        onNodeSelect={handleNodeSelect}
      >
        {filteredReports?.map(el => renderTree(el))}
      </TreeView>
    </TreeViewWrapper>
  )
}

const renderTree = (nodes) => {
  const defineFolder = (elem) => {
    if (checkElement(elem.groups) && checkElement(elem.reports)) {
      return elem.groups.concat(elem.reports).map(el => renderTree(el))
    }
    if (checkElement(elem.groups) || checkElement(elem.reports)) {
      if (checkElement(elem.groups)) {
        return elem.groups.map(el => renderTree(el))
      }
      if (checkElement(elem.reports)) {
        return elem.reports.map(el => renderTree(el))
      }
    }
    return null
  }

  return (
    <TreeItem
      key={ nodes?.id ? nodes.id.toString() : nodes.name }
      nodeId={ nodes?.id ? nodes.id.toString() : nodes.name }
      label={ nodes.name }>
      { defineFolder(nodes) }
    </TreeItem>
  )
}