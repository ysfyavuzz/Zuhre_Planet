# Contexts Dökümantasyonu

React Context provider'ları ve state yönetimi.

## 📋 Context'ler

### AuthContext.tsx

Kullanıcı kimlik doğrulama ve yetkilendirme context'i.

**Provider:**
```typescript
<AuthProvider>
  <App />
</AuthProvider>
```

**Hook:**
```typescript
const { user, login, logout, isLoading } = useAuth();
```

**State:**
- `user` - Mevcut kullanıcı bilgisi
- `isLoading` - Yükleme durumu
- `viewRole` - Görüntüleme rolü ('client', 'escort', 'admin')

**Fonksiyonlar:**
- `login(email, password, role)` - Giriş yap
- `logout()` - Çıkış yap
- `refreshUser()` - Kullanıcı bilgisini yenile

### ThemeContext.tsx

Tema yönetimi context'i (dark mode).

**Provider:**
```typescript
<ThemeProvider>
  <App />
</ThemeProvider>
```

**Hook:**
```typescript
const { theme, toggleTheme } = useTheme();
```

**Seçenekler:**
- `'light'` - Açık tema
- `'dark'` - Karanlık tema
- `'system'` - Sistem tercihi

## 🎯 Kullanım Örnekleri

### Koruma (Route Protection)

```typescript
const { user, isLoading } = useAuth();

if (!isLoading && user?.role !== 'escort') {
  return <Navigate to="/login" />;
}
```

### Tema Değiştirme

```typescript
const { theme, toggleTheme } = useTheme();

<Button onClick={toggleTheme}>
  {theme === 'dark' ? '🌙' : '☀️'}
</Button>
```
