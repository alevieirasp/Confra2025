from . import db
from datetime import datetime

class Reservation(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)
    bike_id = db.Column(db.Integer, nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    shirt_size = db.Column(db.String(10), nullable=False)
    shirt_name = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "bike_id": self.bike_id,
            "name": self.name,
            "shirt_size": self.shirt_size,
            "shirt_name": self.shirt_name,
            "timestamp": self.timestamp.strftime("%d/%m/%Y, %H:%M:%S"),
        }
