import React, { useState } from 'react'
import { Box } from '@mui/material'
import { Field } from 'react-final-form'
import { reportsApi } from 'shared/api'
import { ReportParameterCamel } from 'shared/api/customer'
import { InputLabel } from 'shared/ui/components'
import { Option } from 'shared/ui/components/interface'
import { isNotEmptyArray } from 'shared/lib/checkers/isNotEmptyArray'
import { ParametersArray } from 'shared/ui/components/DataType/ParametersArray'

import { HelperTextSupply, ReportParametersBox } from '../styled'


export interface ReportData {
  id: number;
  name: string;
  description?: string;
  parameters?: ReportParameterCamel[];
}

interface ParametersFieldsProps {
  data: ReportData
  errors?: {}
  visited: {} | undefined
}

const getOptions = (optionItem): Option<number> => ({
  label: optionItem.value || '',
  value: optionItem.id,
})


export const ParametersFields = ({ data, errors, visited }: ParametersFieldsProps ) => {
  const [ queryParameters, setQueryParameters ] = useState<any>(
    data.parameters?.filter(el => (el.dataType === 'number_list' || el.dataType === 'object')).map(elem => ({
      id: elem.id,
      value: elem.defaultValue || null
    }))
  )

  const paramsListQuery = reportsApi.useGetParametersListQuery(
    {
      reportId: data.id,
      params: queryParameters,
    })
  
  return (
    <ReportParametersBox>
      {data?.parameters?.map((el) =>
        <ParameterItem
          key={el.id}
          setQueryParameters={setQueryParameters}
          paramsListQuery={paramsListQuery}
          el={el}
          visited={visited}
          errors={errors}/>
      )}
    </ReportParametersBox>
  )
}

const ParameterItem = ({ el, visited, errors, paramsListQuery, setQueryParameters }) => {
  const options = (el.dataType === 'object' || el.dataType === 'number_list') ?
    paramsListQuery?.data?.find(elem => elem.parameter.id === el.id)?.values?.map(getOptions) || [] :
    undefined

  const handleFocus = () => {
    setQueryParameters(prev => {
      const rest = [...prev]
      rest.forEach((elem, index) => {
        if (elem.id === el.id) {
          rest[index] = { id: el.id, value: null }
        }
      })
      return rest
    })
  }
  const handleBlur = (values) => {
    if (el.dataType === 'object' || el.dataType === 'number_list') {
      setQueryParameters(prev => {
        const rest = [...prev]
        rest.forEach((elem, index) => {
          if (elem.id === el.id) {
            rest[index] = { id: el.id, value: (values || (isNotEmptyArray(values) && Array.isArray(values))) ? values : null }
          }
        })
        return rest
      })
    }
  }
  const component = ParametersArray.find((type) => type.dataType === el.dataType)
  return (
    <Box>
      <InputLabel label={el.name} required={el.required} helpText={el.description}/>
      <Box display="flex" alignItems="center">
        <HelperTextSupply>
          <Field
            key={el.id}
            name={`id${el.id.toString()}`}
            placeholder={el.name}
            type={component?.dataType === 'number' ? 'number' : ''}
            required={el.required}
            options={options}
            onBlur={handleBlur}
            onFocus={handleFocus}
            errorAfterTouch={true}
            isError={visited?.[`id${el.id.toString()}`]}
            helperText={
              (!!errors?.[`id${el.id.toString()}`] && el.dataType === 'date') ||
              visited?.[`id${el.id.toString()}`]
                ? errors?.[`id${el.id.toString()}`]
                : ''}
            error={!!errors?.[`id${el.id.toString()}`]}
            component={component?.component}
            sx={{
              width: '280px'
            }}
          />
        </HelperTextSupply>
      </Box>
    </Box>
  )
}