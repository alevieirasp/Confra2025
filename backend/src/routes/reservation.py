from flask import Blueprint, jsonify, request
from ..models import db
from ..models.reservation import Reservation

reservation_bp = Blueprint("reservation", __name__)

@reservation_bp.get("/reservations")
def list_reservations():
    items = Reservation.query.all()
    return jsonify({r.bike_id: r.to_dict() for r in items})

@reservation_bp.post("/reservations")
def create_reservation():
    data = request.get_json() or {}
    try:
        bike_id = int(data.get("bike_id"))
    except Exception:
        return jsonify({"error": "bike_id inválido"}), 400

    name = data.get("name")
    shirt_size = data.get("shirt_size")
    shirt_name = data.get("shirt_name")

    if not (bike_id and name and shirt_size and shirt_name):
        return jsonify({"error": "Dados incompletos"}), 400

    if Reservation.query.filter_by(bike_id=bike_id).first():
        return jsonify({"error": "Bike já reservada"}), 409

    r = Reservation(bike_id=bike_id, name=name, shirt_size=shirt_size, shirt_name=shirt_name)
    db.session.add(r)
    db.session.commit()
    return jsonify(r.to_dict()), 201

@reservation_bp.delete("/reservations/<int:bike_id>")
def delete_reservation(bike_id):
    r = Reservation.query.filter_by(bike_id=bike_id).first()
    if not r:
        return jsonify({"error": "Reserva não encontrada"}), 404
    db.session.delete(r)
    db.session.commit()
    return jsonify({"ok": True})
