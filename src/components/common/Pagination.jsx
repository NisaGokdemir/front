import {
  Box,
  Pagination as MuiPagination,
  PaginationItem,
  FormControl,
  Select,
  MenuItem,
  Typography,
  useTheme
} from '@mui/material';
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';

const Pagination = ({ page, totalPages, totalElements, size, onPageChange, onSizeChange }) => {
  const theme = useTheme();
  
  if (totalElements === 0) {
    return null;
  }

  const handleSizeChange = (event) => {
    if (onSizeChange) {
      onSizeChange(event);
    }
  };

  const startItem = page * size + 1;
  const endItem = Math.min((page + 1) * size, totalElements);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 2,
      width: '100%',
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
      borderRadius: '12px',
      p: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Gösterim:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select
            value={size}
            onChange={handleSizeChange}
            displayEmpty
            sx={{ 
              '& .MuiOutlinedInput-input': { py: 0.8 },
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <MuiPagination
          count={totalPages}
          page={page + 1}
          onChange={(event, value) => onPageChange(event, value - 1)}
          shape="rounded"
          color="primary"
          size="medium"
          siblingCount={1}
          boundaryCount={1}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: KeyboardArrowLeftIcon, next: KeyboardArrowRightIcon }}
              {...item}
              sx={{ 
                borderRadius: '8px',
                '&.Mui-selected': {
                  fontWeight: 'bold'
                }
              }}
            />
          )}
        />
        <Typography variant="body2" color="text.secondary">
          {startItem}-{endItem} / {totalElements}
        </Typography>
      </Box>
    </Box>
  );
};

export default Pagination; 