import { useState, useEffect } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const SearchBar = ({ placeholder = 'Ara...', onSearch }) => {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <Paper
      component="form"
      elevation={0}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: { xs: '100%', sm: 350 },
        border: '1px solid',
        borderColor: focused ? theme.palette.primary.main : 'divider',
        borderRadius: '8px',
        boxShadow: focused ? `0 0 0 2px ${theme.palette.primary.main}20` : 'none',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <IconButton 
        type="button" 
        sx={{ p: '10px', color: theme.palette.primary.main }} 
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ 
          ml: 1, 
          flex: 1,
          '& .MuiInputBase-input': {
            py: 1.2
          }
        }}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputProps={{ 'aria-label': placeholder }}
      />
      {value && (
        <IconButton 
          type="button" 
          sx={{ p: '10px' }} 
          aria-label="clear" 
          onClick={handleClear}
        >
          <ClearIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBar; 