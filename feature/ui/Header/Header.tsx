import React from 'react'
import { TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface IHeader {
  searchString: string
  setSearchString: React.Dispatch<React.SetStateAction<string>>
}

export const Header = ({ searchString, setSearchString }: IHeader) => (
  <div className="header">
    <span>Отчеты</span>
    <TextField
      className="searchInput"
      size="small"
      id="searchInput"
      variant="standard"
      autoComplete="off"
      placeholder="Поиск"
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          document.getElementById('searchInput')?.blur()
        }
      }}
      value={searchString}
      onChange={(e) => {setSearchString(e.target.value)}}
      InputProps={{
        endAdornment: <SearchIcon sx={{ color: 'rgba(0, 0, 0, 0.26)' }}/>
      }}/>
  </div>
)