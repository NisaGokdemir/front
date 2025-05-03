import DataManagementPage from '../components/DataManagementPage';

const AllergyPage = () => {
  return (
    <DataManagementPage
      title="Alerjiler"
      itemName="Alerji"
      fields={[
        { name: 'name', label: 'Alerji Adı' },
        { name: 'symptoms', label: 'Belirtiler', multiline: true },
        { name: 'description', label: 'Açıklama', multiline: true }
      ]}
      // API fonksiyonları eklenir
    />
  );
};

export default AllergyPage; 