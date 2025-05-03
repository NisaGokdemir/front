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

/**
 * Özelleştirilmiş Sayfalama Bileşeni
 * 
 * @param {Object} props
 * @param {number} props.page - Mevcut sayfa numarası (0-tabanlı)
 * @param {number} props.totalPages - Toplam sayfa sayısı
 * @param {number} props.totalElements - Toplam öğe sayısı
 * @param {Function} props.onPageChange - Sayfa değiştiğinde çağrılacak fonksiyon
 * @param {number} props.pageSize - Sayfa başına öğe sayısı
 * @param {Function} props.onPageSizeChange - Sayfa boyutu değiştiğinde çağrılacak fonksiyon
 * @param {Array} props.pageSizeOptions - Sayfa boyutu seçenekleri
 */
const Pagination = ({ 
  page = 0, 
  totalPages = 0, 
  totalElements = 0, 
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100]
}) => {
  const theme = useTheme();
  
  if (totalElements === 0) {
    return null;
  }

  const handleChange = (event, value) => {
    onPageChange(value - 1);
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    onPageSizeChange(newSize);
  };

  const startItem = totalElements > 0 ? page * pageSize + 1 : 0;
  const endItem = Math.min((page + 1) * pageSize, totalElements);
  const pageInfoText = `${startItem}-${endItem} / ${totalElements}`;

  return (
    <Box sx={{ 
      mt: 4, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2,
      width: '100%',
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
      borderRadius: '12px',
      p: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Gösterilen: {pageInfoText}
        </Typography>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            sx={{ 
              '& .MuiSelect-select': { 
                py: 0.5, 
                fontSize: '0.875rem' 
              },
              borderRadius: '8px'
            }}
          >
            {pageSizeOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <MuiPagination
        count={totalPages}
        page={page + 1}
        onChange={handleChange}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        siblingCount={1}
        size="medium"
        sx={{
          '& .MuiPaginationItem-root': {
            borderRadius: '8px', 
          }
        }}
      />
    </Box>
  );
};

export default Pagination; 