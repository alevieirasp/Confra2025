from flask_sqlalchemy import SQLAlchemy

# Objeto global do SQLAlchemy exportado pelo pacote "models"
db = SQLAlchemy()

__all__ = ["db"]  # opcional
