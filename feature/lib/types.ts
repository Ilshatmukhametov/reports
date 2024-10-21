import { ReportGroupCamel, ReportCamel } from 'shared/api/customer'

export interface ReportsStateProps {
  reportData: ReportCamel | null
  path?: Array<string> | null
}

export interface ParametersFieldsProps {
  data: ReportCamel | null
}

export interface ListProps {
  data?: ReportGroupCamel[]
  report: ReportsStateProps,
  changeReportsParams: (e) => void
  searchString: string
  setReport: React.Dispatch<React.SetStateAction<ReportsStateProps>>
}