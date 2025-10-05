# Sistema de Reservas de Bikes - Aula Especial #Veloucos

Sistema completo para reserva de bikes em aulas especiais, com layout responsivo e funcionalidades completas.

## 🚀 Funcionalidades

- ✅ **Reserva interativa** de bikes (1-38)
- ✅ **Layout responsivo** para mobile e desktop
- ✅ **Formulário completo** com nome, tamanho da camiseta e nome na camiseta
- ✅ **Exportação Excel/CSV** das reservas
- ✅ **Cancelamento** com senha de proteção
- ✅ **Layout físico** idêntico à sala real

## 📁 Estrutura do Projeto

```
projeto-deploy-completo/
├── frontend/                 # React.js Frontend
│   ├── src/
│   │   ├── App.jsx          # Componente principal
│   │   ├── App.css          # Estilos responsivos
│   │   └── assets/          # Imagens
│   ├── package.json
│   └── vercel.json          # Configuração Vercel
├── backend/                  # Flask Backend
│   ├── src/
│   │   ├── main.py          # Aplicação Flask
│   │   ├── models/          # Modelos do banco
│   │   └── routes/          # Rotas da API
│   ├── requirements.txt
│   └── railway.json         # Configuração Railway
└── README.md
```

## 🌐 Deploy

### Frontend (Vercel)
1. Conecte seu repositório GitHub ao Vercel
2. Configure a variável `VITE_API_URL` com a URL do backend
3. Deploy automático a cada push

### Backend (Railway)
1. Conecte seu repositório GitHub ao Railway
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## ⚙️ Configuração

### Variáveis de Ambiente

#### Frontend (Vercel)
```
VITE_API_URL=https://seu-backend.railway.app
```

#### Backend (Railway)
```
DATABASE_URL=postgresql://... (automático)
SECRET_KEY=sua-chave-secreta
FLASK_ENV=production
```

## 🛠️ Desenvolvimento Local

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
cd src
python main.py
```

## 📊 Tecnologias

- **Frontend**: React.js, Vite, Tailwind CSS
- **Backend**: Flask, SQLAlchemy, PostgreSQL
- **Deploy**: Vercel + Railway
- **Banco**: PostgreSQL (produção), SQLite (desenvolvimento)

## 🎯 Características

- **Responsivo**: Funciona perfeitamente em mobile
- **Rápido**: CDN global via Vercel
- **Escalável**: Infraestrutura em nuvem
- **Gratuito**: Planos gratuitos Vercel + Railway
- **Seguro**: HTTPS automático

## 📱 Acesso

O sistema é otimizado para compartilhamento via WhatsApp e acesso em smartphones.

---

**Desenvolvido para aulas especiais de bike #Veloucos**

