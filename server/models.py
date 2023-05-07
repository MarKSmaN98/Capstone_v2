from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import db
from datetime import datetime
from config import bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('user_carts', '-cart.cart_user', '-_password')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)    
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    _password = db.Column(db.String(120), nullable=False)
    account_type = db.Column(db.Integer, nullable=False, default=0) #0 is normal user, 1 is seller
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_carts = db.relationship('Cart', backref='user', lazy=True, cascade='all, delete')
    sellerItems = db.relationship('Item', backref='user', lazy=True, cascade='all, delete')
    #needs @validates
    @hybrid_property
    def password(self):
        return self._password
    
    @password.setter
    def password(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password = password_hash.decode('utf-8')
    
    def authenticate(self, attempt):
        return bcrypt.check_password_hash(
            self._password, attempt.encode('utf-8')
        )

class Cart(db.Model, SerializerMixin):
    __tablename__ = 'carts'
    serialize_rules = ('cart_items', '-user', 'items')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    paid = db.Column(db.Boolean, nullable=False, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    items = association_proxy('cart_items', 'item')
    cart_items = db.relationship('CartItem', backref='cart', cascade='all, delete')

    def get_items(self):
        new_cart_items = CartItem.query.filter_by(cart_id=self.id).all()
        items = [cart_item.item.to_dict() for cart_item in new_cart_items]
        return items
    
    def getQuantityForItem(self, itemID):
        target = CartItem.query.filter(CartItem.cart_id == self.id, CartItem.item_id == itemID).first()
        if target == None:
            return 0
        return target.quantity
        

    # def to_dict(self):
    #     return {
    #         'id': self.id,
    #         'name': self.name,
    #         'paid': self.paid,
    #         'user_id': self.user_id,
    #         'items': self.get_items()
    #     }

class Item (db.Model, SerializerMixin):
    __tablename__ = 'items'
    serialize_rules = ('-cart', '-cart_items', '-user')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    tags = db.Column(db.String, nullable=False) #eventually another table probably
    price = db.Column(db.Float, nullable=False)
    img = db.Column(db.String, nullable=False) #another table?
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cart = association_proxy('cart_items', 'cart')
    cart_items = db.relationship('CartItem', backref='item')

class CartItem(db.Model, SerializerMixin):
    __tablename__ = 'cart_items'
    serialize_rules = ('-cart.cart_items', '-item.cart_items', '-cart', '-item.cart', 'cart_id', 'cart.id')

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'))
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))

    def to_dict(self):
        return {
            'id': self.id,
            'item': self.item.to_dict(),
            'quantity': self.quantity
        }


