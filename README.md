# DesarrolloPersonal Next.js

Plataforma de Desarrollo Personal construida con Next.js 15, TypeScript, Clerk Auth, y MySQL.

## 🚀 Tecnologías

- **Framework**: Next.js 15 con App Router
- **Language**: TypeScript
- **Autenticación**: Clerk
- **Base de Datos**: MySQL con Prisma ORM
- **Styling**: Tailwind CSS
- **CDN**: Bunny.net
- **Pagos**: Stripe (opcional)
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 📋 Requisitos Previos

- Node.js >= 20.0.0
- npm >= 10.0.0
- MySQL 8.0+
- Clerk account
- Bunny.net account (para CDN)

## ⚙️ Configuración de Desarrollo

### 1. Clonación del Proyecto

```bash
git clone https://github.com/juanchorojasb/desarrollopersonal-nextjs.git
cd desarrollopersonal-nextjs
```

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Configuración de Variables de Entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores reales:

```bash
# Base de datos
DATABASE_URL="mysql://user:pass@localhost:3307/desarrollopersonal_db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Bunny CDN
BUNNY_STORAGE_ZONE_NAME="tu_zona"
BUNNY_USERNAME="tu_usuario"
BUNNY_PASSWORD="tu_password"
NEXT_PUBLIC_BUNNY_CDN_URL="https://tu-dominio.b-cdn.net"
```

### 4. Base de Datos

```bash
# Generar cliente Prisma
npm run db:generate

# Sincronizar esquema
npm run db:push

# (Opcional) Abrir Prisma Studio
npm run db:studio
```

### 5. Validación del Entorno

```bash
npm run env:check
```

### 6. Iniciar Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3010`

## 🏗️ Scripts Disponibles

### Desarrollo
- `npm run dev` - Servidor de desarrollo (puerto 3010)
- `npm run build` - Build de producción
- `npm start` - Servidor de producción

### Base de Datos
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Sincronizar esquema con DB
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:seed` - Poblar base de datos

### Calidad de Código
- `npm run lint` - Ejecutar ESLint
- `npm run lint:fix` - Corregir errores automáticamente
- `npm run type-check` - Verificar tipos de TypeScript

### Testing
- `npm test` - Ejecutar tests
- `npm run test:watch` - Tests en modo watch
- `npm run test:coverage` - Tests con cobertura

### Utilidades
- `npm run env:check` - Validar variables de entorno
- `npm run clean` - Limpiar archivos build
- `npm run analyze` - Analizar bundle

## 🚀 Deployment

### Desarrollo Local

```bash
npm run deploy:local
```

### Producción

1. **Validar entorno**:
   ```bash
   npm run env:check
   ```

2. **Build de producción**:
   ```bash
   npm run build:prod
   ```

3. **Deploy con PM2**:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

### Comandos PM2

```bash
# Monitoreo
npm run logs          # Ver logs
npm run status        # Estado de procesos
npm run monitor       # Monitor en tiempo real

# Control
npm run restart       # Reiniciar aplicación
npm run stop          # Detener aplicación
```

## 🗂️ Estructura del Proyecto

```
desarrollopersonal-nextjs/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Rutas de autenticación
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard del usuario
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuración
├── prisma/               # Esquemas y migraciones
├── public/               # Archivos estáticos
├── scripts/              # Scripts de utilidad
└── types/                # Definiciones TypeScript
```

## 🔐 Autenticación

La aplicación usa Clerk para autenticación:

- **Sign In**: `/sign-in`
- **Sign Up**: `/sign-up`
- **Dashboard**: `/dashboard` (protegido)
- **Profile**: `/profile` (protegido)

## 📊 Base de Datos

### Conexión

- **Host**: localhost
- **Puerto**: 3307
- **Base**: desarrollopersonal_db

### Migraciones

```bash
# Crear nueva migración
npm run db:migrate

# Aplicar en producción  
npm run db:migrate:prod

# Reset completo (¡CUIDADO!)
npm run db:reset
```

## 🛡️ Seguridad

### Variables de Entorno

- Nunca commitear archivos `.env` con valores reales
- Usar secretos seguros (32+ caracteres)
- Rotar credenciales regularmente

### Base de Datos

- Usar usuarios con permisos mínimos
- Habilitar SSL en producción
- Backup regular automatizado

## 📈 Monitoreo

### Logs

Los logs se almacenan en:
- **Desarrollo**: Consola
- **Producción**: `/var/log/projects/desarrollopersonal/`

### Métricas

```bash
# Health check
npm run health:check

# Estado del servidor
pm2 status
```

## 🔧 Troubleshooting

### Problemas Comunes

1. **Puerto en uso**:
   ```bash
   lsof -ti:3010 | xargs kill -9
   ```

2. **Error de base de datos**:
   ```bash
   npm run db:push
   ```

3. **Variables de entorno**:
   ```bash
   npm run env:check
   ```

### Logs de Error

```bash
# Ver logs en tiempo real
npm run logs

# Logs específicos
tail -f /var/log/projects/desarrollopersonal/error.log
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push a rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Convenciones

- **Commits**: Conventional Commits
- **Código**: ESLint + Prettier
- **Tests**: Jest con coverage > 80%

## 📝 Changelog

Ver [CHANGELOG.md](./CHANGELOG.md) para historial de versiones.

## 📄 Licencia

MIT License - ver [LICENSE](./LICENSE) para detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/juanchorojasb/desarrollopersonal-nextjs/issues)
- **Email**: soporte@desarrollopersonal.uno
- **Documentación**: [Wiki del proyecto](https://github.com/juanchorojasb/desarrollopersonal-nextjs/wiki)

---

**Servidor**: srv909554  
**Puerto**: 3010 (esquema estandarizado)  
**Ambiente**: Producción
