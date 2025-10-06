import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# imports via pacote "src"
from .models import db
from .routes.reservation import reservation_bp

load_dotenv()

# se quiser servir front estático, coloque o build em backend/static
app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# DATABASE_URL (Render) ou SQLite local
database_url = os.environ.get('DATABASE_URL')
if database_url:
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bike_reservas.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

db.init_app(app)

# API
app.register_blueprint(reservation_bp, url_prefix='/api')

# rotas para estático (opcional)
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    try:
        return send_from_directory(app.static_folder, path)
    except Exception:
        return send_from_directory(app.static_folder, 'index.html')

# cria tabelas
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

