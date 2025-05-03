# 🐾 Veteriner Klinik Yönetim Paneli (Frontend)

## 📌 Genel Bilgiler

Bu panel, veteriner kliniklerinde kullanılmak üzere geliştirilen bir **rol tabanlı yetkilendirme sistemi** içeren yönetim arayüzüdür. 
React, TailwindCSS ve MUI (Material UI) teknolojileri ile geliştirilecektir.

- Backend hazırdır.
- Yetkilendirme (Authorization) sistemine sahiptir.
- Kimlik doğrulama (Authentication) JWT Token sistemiyle yapılmaktadır.
- Kullanıcı rolleri: `ROLE_ADMIN`, `ROLE_VETERINARIAN`, `ROLE_RECEPTIONIST`

## 🧠 Kullanıcı Rolleri & Yetkiler

| Role             | Görüntüleyebileceği Sayfalar                                         |
|------------------|----------------------------------------------------------------------|
| `ROLE_ADMIN`      | Tüm sayfalar                                                         |
| `ROLE_VETERINARIAN` | Hasta, Hasta Sahibi, Kan Grubu, Tür, Irk, Tanı, Reçete, İlaç        |
| `ROLE_RECEPTIONIST` | Hasta, Hasta Sahibi                                                 |

## 🔐 Auth Süreci

### 1. Kayıt (Register)

```http
POST http://localhost:8081/api/auth/register
Content-Type: application/json
Body:
{
  "username": "user1", 
  "password": "pass",
  "firstName": "UserName",
  "lastName": "UserLastName",
  "email": "user1@example.com",
  "specializationId": 1    
}
Response:

json
Kopyala
Düzenle
200 OK
"Kayıt başarılı"
📝 Not: Yeni kayıt olan kullanıcıya otomatik olarak ROLE_RECEPTIONIST atanır.

2. Giriş (Login)
http
Kopyala
Düzenle
POST http://localhost:8081/api/auth/login
Content-Type: application/json
Body:
{
  "username": "user1", 
  "password": "pass"
}
Response:

json
Kopyala
Düzenle
{
  "token": "JWT_TOKEN_STRING",
  "refreshToken": "REFRESH_TOKEN_STRING"
}
3. Token Yenileme (Refresh Token)
http
Kopyala
Düzenle
POST http://localhost:8081/api/auth/refresh-token
Content-Type: application/json
Body:
{
  "refreshToken": "REFRESH_TOKEN_STRING"
}
Response:

json
Kopyala
Düzenle
{
  "token": "NEW_JWT_TOKEN",
  "refreshToken": "SAME_REFRESH_TOKEN"
}
🔄 Token süresi dolduğunda otomatik olarak yenileme işlemi yapılacak. Yenileme başarısız olursa kullanıcı login ekranına yönlendirilir.

🧾 JWT Token Decode
json
Kopyala
Düzenle
{
  "roles": ["ROLE_RECEPTIONIST"],
  "sub": "user1",
  "iat": 1745494739,
  "exp": 1745498339
}
Token içinden roles bilgisi alınarak kullanıcıya gösterilecek sayfalar filtrelenecek.

🔐 Backend Endpoint Yetkilendirme (Spring Security)
java
Kopyala
Düzenle
.requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
.requestMatchers("/api/users/**").hasRole("ADMIN")
.requestMatchers("/api/specializations/**").hasRole("ADMIN")
.requestMatchers("/api/species/**").hasAnyRole("ADMIN","VETERINARIAN")
.requestMatchers("/api/bloodTypes/**").hasAnyRole("ADMIN","VETERINARIAN")
.requestMatchers("/api/breeds/**").hasAnyRole("ADMIN","VETERINARIAN")
.requestMatchers("/api/diagnosis/**").hasAnyRole("ADMIN","VETERINARIAN")
.requestMatchers("/api/prescriptions/**").hasAnyRole("ADMIN","VETERINARIAN")
.requestMatchers("/api/prescription-items/**").hasAnyRole("ADMIN","VETERINARIAN")
.requestMatchers("/api/medication/**").hasAnyRole("ADMIN","VETERINARIAN")
.requestMatchers("/api/medication-batch/**").hasAnyRole("ADMIN","VETERINARIAN")
.requestMatchers("/api/owners/**").hasAnyRole("ADMIN","VETERINARIAN", "RECEPTIONIST")
.requestMatchers("/api/patients/**").hasAnyRole("ADMIN","VETERINARIAN", "RECEPTIONIST")
🎨 UI Yapısı
✅ Kullanılan Teknolojiler
React

TailwindCSS (stil düzenlemeleri)

MUI (bileşenler ve temalar)

JWT (Kimlik doğrulama)

🧭 Navigasyon Yapısı
Navbar KULLANILMAYACAK, onun yerine modern Sidebar kullanılır.

Sidebar'da yer alacak menüler:

Hasta Sahibi

Kan Grubu

Tür

Irk

Hasta (İçerisine Tanı ve Reçete tabları yerleştirilecek)

Aşı

Alerji

İlaç

Teslimat (Partiye göre ilaç eklemek)

🛡️ Her menü item’ı role bazlı görünür olacaktır.
Örneğin ROLE_RECEPTIONIST sadece Hasta ve Hasta Sahibi sekmesini görebilir.

📁 Proje Yapısı (Önerilen Modüler Yapı)
bash
Kopyala
Düzenle
src/
├── components/
│   ├── Sidebar.tsx
│   ├── ProtectedRoute.tsx
│   └── RoleBasedRoute.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Patients/
│   ├── Owners/
│   ├── Diagnosis/
│   └── Medications/
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   └── authService.ts
├── utils/
│   └── jwtDecode.ts
└── App.tsx
🔄 Güvenlik ve Token Yönetimi
Login sonrası JWT Token localStorage'a kaydedilir.

Sayfa her yüklendiğinde token valid mi kontrol edilir.

Süresi dolduysa refresh-token endpointi çağrılır.

Token çözümleme jwt-decode gibi bir kütüphane ile yapılır.

Eğer tüm işlemler başarısızsa kullanıcı login sayfasına yönlendirilir.

✅ Best Practices
⚛️ Her sayfa kendi bileşeni olacak.

♻️ Kod tekrarından kaçınmak için HOC ve Custom Hook yapısı kullanılacak.

🔒 RoleBasedRoute ile yetki kontrolü yapılacak.

🧼 Clean Code ve ESLint uyumlu yazılacak.

🧪 Gerektiğinde testler için Jest kullanılabilir.