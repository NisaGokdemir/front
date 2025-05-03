import { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Box,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

/**
 * Özelleştirilmiş Arama Çubuğu Bileşeni
 * 
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder metni
 * @param {string} props.value - Arama terimi
 * @param {Function} props.onChange - Değer değiştiğinde çağrılacak fonksiyon
 * @param {Object} props.sx - Ek stil özellikleri
 * @param {boolean} props.autoFocus - Otomatik odaklanma
 * @param {number} props.debounceTime - Debounce süresi (ms)
 */
const SearchBar = ({ 
  placeholder = 'Ara...', 
  value = '', 
  onChange,
  sx = {},
  autoFocus = false,
  debounceTime = 300
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState(value);
  
  // Değer değiştiğinde debounce ile işlem yap
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm);
      }
    }, debounceTime);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, value, onChange, debounceTime]);

  // Dışarıdan gelen değer değişirse state'i güncelle
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  /**
   * Arama alanını temizler
   */
  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Paper
        elevation={0}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          p: 0.5,
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)'}`,
          borderRadius: '8px',
          '&:hover': {
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.20)',
          },
          transition: 'border-color 0.2s'
        }}
      >
        <InputAdornment position="start" sx={{ pl: 1 }}>
          <SearchIcon color="action" />
        </InputAdornment>
        
        <TextField
          fullWidth
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={autoFocus}
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          sx={{ ml: 1 }}
        />
        
        {searchTerm && (
          <IconButton 
            size="small" 
            onClick={handleClear}
            aria-label="Aramayı temizle"
            sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
};

export default SearchBar; 