import os
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Inicializar Flask
app = Flask(__name__)

# Configuração CORS
CORS(app, origins=['*'])

# Configuração do banco de dados
if os.environ.get('DATABASE_URL'):
    # Produção (Railway) - PostgreSQL
    database_url = os.environ.get('DATABASE_URL')
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Desenvolvimento - SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bike_reservas.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Inicializar banco
db = SQLAlchemy(app)

# Importar modelos
from models.reservation import Reservation

# Importar rotas
from routes.reservation import reservation_bp

# Registrar blueprints
app.register_blueprint(reservation_bp, url_prefix='/api')

# Rota para servir arquivos estáticos (frontend)
@app.route('/')
def serve_frontend():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    try:
        return send_from_directory('static', path)
    except:
        return send_from_directory('static', 'index.html')

# Criar tabelas
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)

