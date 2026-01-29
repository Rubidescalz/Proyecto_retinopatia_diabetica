# Sistema de Detección de Retinopatía Diabética

## 🚀 Ejecutar Localmente

### Opción 1: Iniciar TODO con un click (Recomendado)
```bash
start_all.bat
```
Esto abrirá 2 ventanas de terminal:
- Backend en: http://localhost:8000
- Frontend en: http://localhost:5173

---

### Opción 2: Iniciar manualmente

#### **Backend (Terminal 1)**
```bash
start_backend.bat
```
O manualmente:
```bash
cd BanckEnd
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### **Frontend (Terminal 2)**
```bash
start_frontend.bat
```
O manualmente:
```bash
cd FrontEnd
npm install
npm run dev
```

---

## 📌 URLs Locales

| Servicio | URL | Descripción |
|----------|-----|------------|
| Frontend | http://localhost:5173 | Aplicación React |
| Backend API | http://localhost:8000 | API FastAPI |
| API Docs | http://localhost:8000/docs | Swagger UI (prueba endpoints) |

---

## 🔧 Requisitos

- **Python 3.10+** → [Descargar](https://www.python.org/downloads/)
- **Node.js 18+** → [Descargar](https://nodejs.org/)

Verifica instalación:
```bash
python --version
node --version
npm --version
```

---

## 📁 Estructura del Proyecto

```
System_RD/
├── BanckEnd/          # API FastAPI (Python)
│   ├── main.py
│   ├── requirements.txt
│   ├── config.py
│   ├── modelo/        # Modelo entrenado (.h5)
│   ├── models/
│   ├── services/
│   └── utils/
├── FrontEnd/          # React + Vite (JavaScript)
│   ├── src/
│   ├── package.json
│   └── .env           # Configuración local
├── start_backend.bat
├── start_frontend.bat
└── start_all.bat
```

---

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar Python
python --version

# Reinstalar dependencias
pip install --upgrade pip
pip install -r BanckEnd/requirements.txt
```

### Frontend no inicia
```bash
# Limpiar caché
cd FrontEnd
del -r node_modules
del package-lock.json
npm install
npm run dev
```

### Error de conexión entre frontend y backend
- Asegúrate que el backend esté en http://localhost:8000
- Verifica que el frontend use http://localhost:8000 en `.env`
- Abre la consola del navegador (F12) para ver errores

---

## 🌐 Despliegue en Producción

- **Backend**: [Railway](https://railway.app) → https://proyectoretinopatiadiabetica-production.up.railway.app
- **Frontend**: [Vercel](https://vercel.com) o [Netlify](https://netlify.com)

---

**¡Listo! Ahora puedes trabajar localmente en tu PC.**
