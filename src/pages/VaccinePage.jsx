import DataManagementPage from '../components/DataManagementPage';

const VaccinePage = () => {
  return (
    <DataManagementPage
      title="Aşılar"
      itemName="Aşı"
      fields={[
        { name: 'name', label: 'Aşı Adı' },
        { name: 'manufacturer', label: 'Üretici' },
        { name: 'description', label: 'Açıklama', multiline: true }
      ]}
      // API fonksiyonları eklenir
    />
  );
};

export default VaccinePage; 