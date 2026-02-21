from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import db, Restaurant, Dish
import os

app = Flask(__name__, static_folder='../frontend')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Serve static frontend files
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_files(path):
    return app.send_static_file(path)

# Routes for restaurants
@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    restaurants = Restaurant.query.all()
    return jsonify([{'id': r.id, 'name': r.name, 'created_at': r.created_at.isoformat()} for r in restaurants])

@app.route('/api/restaurants', methods=['POST'])
def add_restaurant():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    restaurant = Restaurant(name=name)
    db.session.add(restaurant)
    db.session.commit()
    return jsonify({'id': restaurant.id, 'name': restaurant.name, 'created_at': restaurant.created_at.isoformat()}), 201

# Routes for dishes
@app.route('/api/restaurants/<int:restaurant_id>/dishes', methods=['GET'])
def get_dishes(restaurant_id):
    dishes = Dish.query.filter_by(restaurant_id=restaurant_id).all()
    return jsonify([{'id': d.id, 'name': d.name, 'price': d.price, 'order_number': d.order_number, 'created_at': d.created_at.isoformat()} for d in dishes])

@app.route('/api/restaurants/<int:restaurant_id>/dishes', methods=['POST'])
def add_dish(restaurant_id):
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    if not name or price is None:
        return jsonify({'error': 'Name and price are required'}), 400
    dish = Dish(name=name, price=price, restaurant_id=restaurant_id)
    db.session.add(dish)
    db.session.commit()
    return jsonify({'id': dish.id, 'name': dish.name, 'price': dish.price, 'order_number': dish.order_number, 'created_at': dish.created_at.isoformat()}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
