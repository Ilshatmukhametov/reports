import React, { memo } from 'react'
import { Box, Typography } from '@mui/material'
import { Form } from 'react-final-form'
import * as yup from 'yup'
import { reportsGen } from 'shared/lib/generated'
import defaultReportImage from 'assets/images/defaultReportImage.svg'
import useValidationSchema from 'shared/lib/hooks/useYupValidation'
import { yupTransformEmptyStringInNull } from 'shared/lib/utils'
import { snackActions } from 'shared/lib/react/snackbar'
import { ParametersFieldsProps } from 'features/analytics/reports/lib/types'
import { isNotNil } from 'shared/lib/checkers'
import { isNotEmptyArray } from 'shared/lib/checkers/isNotEmptyArray'
import LoadingButton from '@mui/lab/LoadingButton'
import { ExcelIcon } from 'shared/ui/styled/ExcelIcon'
import icon from 'assets/images/icons/excel.svg'

import { ParametersFields } from './ParametersFields'

import { ReportDescription, StyledReportBox } from '../styled'

interface ArrayProps {
  id: number
  value: string
}
export const ReportInfo = memo(( { data }: ParametersFieldsProps  ) => {
  const { mutate: generateFile, isLoading: isLoadingFile, variables } = reportsGen.reports.GenerateReport.useGenerateReport()

  const defaultValue = data?.parameters?.reduce((obj, item) => ({
    ...obj,
    [`id${  item.id}`]: item.defaultValue
  }), {}) || {}

  const downloadReportFile = (values) => {
    const arrayValues: Array<ArrayProps> = []
    Object.keys(values).forEach((key) => {
      if ((isNotEmptyArray(values[key])) || (isNotNil(values[key]) && !Array.isArray(values[key])) ) {
        arrayValues.push({ 'id': Number(key.replace(/^\D+/g, '')), 'value': values[key] })
      }
    })
    const arr = arrayValues.filter((el) => el.id !== 0)

    if (data !== null) {
      generateFile({
        reportId: data.id,
        data: arr
      },
      {
        onSuccess: () => {
          snackActions.info('Отчет формируется')
        },
        onError: (e) => {
          if (e.message !== 'canceled') {
            snackActions.error('Произошла ошибка при загрузке файла')
          }
          else {
            snackActions.warning('Выгрузка отчета отменена')
          }
        }
      }
      )
    }
  }

  const getValidationSchema = (reportParameters) => {
    const params = {}
    if (reportParameters !== undefined) {
      reportParameters.forEach(
        param => {
          if (param.required) {
            params[`id${param.id.toString()}`] =
              yup.
                mixed().
                nullable()
                .required('Обязательное поле')
          }
          if (param.dataType === 'date') {
            params[`id${param.id.toString()}`] =
              yup.
                date().
                nullable().
                typeError('Данные введены неверно').
                transform(yupTransformEmptyStringInNull)
          }
          if (param.required && param.dataType === 'date') {
            params[`id${param.id.toString()}`] =
              yup.
                date().
                nullable().
                typeError('Данные введены неверно').
                transform(yupTransformEmptyStringInNull).
                required('Обязательное поле')
          }
        }
      )
    }
    return yup.object().shape(params)
  }

  const validate = useValidationSchema(getValidationSchema(data?.parameters))
  
  const isCurrentReportFile = variables?.reportId === data?.id
  return (
    <StyledReportBox>
      {data ?
        <Form
          onSubmit={downloadReportFile}
          initialValues={defaultValue}
          validate={validate}
          render={({
            handleSubmit,
            valid,
            errors,
            visited
          }) => (
            <form onSubmit={ handleSubmit }>
              <ReportDescription>
                <Typography>{ data.name }</Typography>
                { data.description &&
                  <Box>
                    <span>{ data?.description }</span>
                  </Box>
                }
              </ReportDescription>
              <ParametersFields
                key={ data?.id }
                visited={ visited }
                errors={ errors }
                data={ data }
              />
              <div className="buttons-container">
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loadingPosition="start"
                  startIcon={ <ExcelIcon src={ icon } alt="excelImg" /> }
                  onClick={ handleSubmit }
                  disabled={ !valid || (!isCurrentReportFile && isLoadingFile) }
                  loading={ isLoadingFile && isCurrentReportFile }>
                  ЭКСПОРТ
                </LoadingButton>
              </div>
            </form>
          ) }
        />
        :
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
          <img alt="altReport" src={ defaultReportImage } style={ { marginBottom: '72px' } } />
        </Box>
      }
    </StyledReportBox>
  )
}
)