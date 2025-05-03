# Veteriner Yönetim Sistemi

Bu proje, veteriner klinikleri için modern, kullanıcı dostu bir yönetim sistemi sunmaktadır.

## Hasta Sahibi Modülü

Hasta sahibi modülü tamamen yeniden yazılmıştır. Bu modül, hasta sahiplerinin bilgilerinin yönetilmesini sağlar. Backend yapısına uygun olarak aşağıdaki alanları içerir:

- **Ad (firstName)**: Hasta sahibinin adı
- **Soyad (lastName)**: Hasta sahibinin soyadı
- **Telefon (phone)**: İletişim numarası
- **E-posta (email)**: E-posta adresi
- **Adres (address)**: Detaylı adres bilgisi
- **Borç (debt)**: Ödeme durumu bilgisi
- **Notlar (notes)**: Özel notlar

### Özellikler

- Hasta sahiplerini listeleme
- Arama ve filtreleme
  - Ad, soyad, telefon, e-posta ve adres bilgilerine göre arama
- Yeni hasta sahibi ekleme
- Mevcut hasta sahiplerini düzenleme
- Hasta sahiplerini silme
- Sayfalama özelliği

### Teknik Detaylar

- Backend entegrasyonu için `ownerService.js` servisi tamamen yeniden yapılandırıldı
- Frontend formları ve bileşenleri backend veri yapısına uygun olarak güncellendi:
  - fullName -> firstName + lastName dönüşümleri
  - Doğrulama işlemleri Türkiye telefon numarası formatına uygun hale getirildi
  - Borç ve notlar için alanlar eklendi

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## API Bağlantısı

Backend API'ye bağlantı Vite proxy yapılandırması ile sağlanmaktadır:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8081',
      changeOrigin: true,
      secure: false,
    }
  }
}
```
