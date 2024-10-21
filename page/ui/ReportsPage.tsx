import * as React from 'react'
import { customerApi } from 'shared/api'
import Paper from '@mui/material/Paper'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { StyledBox } from 'features/analytics/reports/ui/styled'
import { ReportInfo } from 'features/analytics/reports/ui/ReportsParameters/ReportInfo'
import { ReportsFolder } from 'features/analytics/reports/ui/ReportsFolder/ReportsFolder'
import { ReportsStateProps } from 'features/analytics/reports/lib/types'
import { findReport } from 'features/analytics/reports/lib/findReports'
import { Header } from 'features/analytics/reports/ui/Header/Header'

export const ReportsPage = () => {
  const { search } = useLocation()
  const searchObj = queryString.parse(search)

  const [report, setReport] = React.useState<ReportsStateProps>({ reportData: null, path: null })
  const [searchString, setSearchString] = useState<string>('')
  
  const { data } = customerApi.reports.useGetReportsQuery()

  const changeReportsParams = (params) => {
    const historyStr = queryString.stringify(
      { ...searchObj, ...params },
      { skipEmptyString: true, skipNull: true, encode: true }
    )
    window.history.pushState({}, '', `?${historyStr}`)
  }

  useEffect(() => {
    if (data) {
      const rep = findReport(data, Number(searchObj.reportId))
      setReport({ reportData: rep.node, path: rep.path })
    }
  }, [data])

  return (
    <StyledBox component={Paper}>
      <Header setSearchString={setSearchString} searchString={searchString}/>
      <div className="reports-container">
        { data ?
          <ReportsFolder
            searchString={searchString}
            changeReportsParams={changeReportsParams}
            report={report}
            data={data}
            setReport={setReport}
          /> :
          <></>
        }
        <ReportInfo
          key={report.reportData?.id}
          data={report.reportData}
        />

      </div>
    </StyledBox>
  )
}