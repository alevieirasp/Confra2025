import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# imports do pacote (relativos ao "src")
from .models import db
from .routes.reservation import reservation_bp

# Carregar variáveis de ambiente
load_dotenv()

# Inicializar Flask
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)  # libera CORS; ajuste depois se quiser restringir

# Configuração do banco de dados
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Produção (Render) - PostgreSQL
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Desenvolvimento - SQLite local
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bike_reservas.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Inicializar banco no app
db.init_app(app)

# Registrar blueprints da API
app.register_blueprint(reservation_bp, url_prefix='/api')

# Rotas para servir o build estático (se você colocar o frontend em backend/static)
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    try:
        return send_from_directory(app.static_folder, path)
    except Exception:
        return send_from_directory(app.static_folder, 'index.html')

# Criar tabelas
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)


