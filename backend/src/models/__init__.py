# Models package
from flask_sqlalchemy import SQLAlchemy

# objeto global do SQLAlchemy exportado pelo pacote "models"
db = SQLAlchemy()

__all__ = ["db"]  # opcional, deixa explícito

