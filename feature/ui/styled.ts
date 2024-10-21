import { Box } from '@mui/material'
import styled from 'styled-components'
import ListItemButton from '@mui/material/ListItemButton'
import { InputWrapper } from 'shared/ui/styled/InputWrapper'

export const StyledBox = styled(Box)`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  
  .header {
    display: flex;
    flex-direction: column;
    padding: 16px 24px 16px 24px;
    gap: 32px;
    height: 128px;
    box-shadow: 0 -1px 0 0 #E0E0E0 inset;

    span {
      font-size: 24px;
      color: ${({ theme }) => theme.palette.text.primary};
    }
    
    .MuiTextField-root {
      width: 220px;
      
      .MuiInput-root {
        :before {
          border-bottom: 1px solid #00000042
        }
      }
    }
  }
  .reports-container {
    min-height: 590px;
    display: flex;
    flex-direction: row;
  }
`

export const InputLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  span {
    color: rgb(0, 125, 255);
  }
`

export const StyledReportBox = styled(Box)`
  padding-top: 16px;
  padding-left: 16px;
  min-height: 100%;
  width: 100%;
  border-left: 1px solid #E0E0E0;

  .buttons-container {
    width: 280px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 24px;
    margin-bottom: 40px;
    button:last-child {
      width: 130px
    }
  }
`

export const ReportDescription = styled(Box)`
  p {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 24px;
  }
  div {
    width: 600px;
    padding: 16px 24px;
    background-color: #F5F5F5;
    border-radius: 4px;
    margin-bottom: 24px;
    p {
      font-size: 16px;
    }
  }
`

export const ReportParametersBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 280px;
`

export const HelperTextSupply = styled(InputWrapper)`
  position: relative;
  .MuiFormHelperText-root {
    position: absolute;
    bottom: -22px;
    left: -15px;
  }
`

export const StyledListButton = styled(ListItemButton)<{ step: number, padding: number }>`
  height: 52px;
  padding-left:${({ step, padding }) => step === 0 ? '16px' : padding};

  &.Mui-selected {
    background-color: #FAFAFA; 
    
    :hover {
      background-color: #FAFAFA
    }
  };
  
  :hover {
  background-color: #FAFAFA
}
`

export const TreeViewWrapper = styled.div`
  min-width: 320px;
  padding-top: 16px;
  padding-bottom: 16px;

  .searchInput {
    color: rgba(0, 0, 0, 0.26);
    display: flex;
    min-width: 100px;
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 16px;
  }
  .MuiTreeItem-iconContainer {
    svg {
      font-size: 1.5rem;
    }
  }
  .MuiTreeItem-content {
    height: 52px;
    padding: 0 16px;

    .MuiTreeItem-label {
      font-size: 14px;
      padding-left: 4px;

      highlight {
        background-color: yellow;
      }
    }
  }
  .MuiTreeItem-content:has(.MuiTreeItem-iconContainer):has(svg) {
    .MuiTreeItem-label {
      font-weight: 500;
      font-size: 16px;
    }
  }
`