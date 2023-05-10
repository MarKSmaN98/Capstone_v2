from flask import Flask, session, request, make_response, jsonify
from flask_restful import Resource
from config import app, db, api
from models import User, Cart, Item, CartItem
from flask_bcrypt import Bcrypt
import ipdb


#Routes_____________________________________________

@app.before_request
def auth_user():
    if not session.get('user_id') and request.endpoint not in ['items', 'login']:
        resp = make_response({'error':'Not Authorized'}, 401)
        return resp

class Login(Resource):
    # def get(self):
    #     pass
    def post(self):
        # ipdb.set_trace()
        print(request.get_json())
        user = User.query.filter(User.username == request.get_json()['username']).first()
        password = request.get_json()['password']
        if user == None:
            resp = make_response({'error':'User Not Found'}, 404)
            return resp
        else:
            if user.authenticate(password):
                session['user_id'] = user.id
                resp = make_response(user.to_dict(), 200)
                return resp
            else:
                return {'error':'Invalid Password'}, 401
api.add_resource(Login, '/backlogin', endpoint='login')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {'message':'204: No Content'}, 204
api.add_resource(Logout, '/logout')

class CheckSession(Resource):
    def get(self):
    #     user = User.query.filter(User.id == session.get('user_id')).first()
    #     if user:
    #         return user.to_dict()
    #     else:
    #         return {'message': session.get('user_id')}, 401
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': session.get('user_id')}, 401
api.add_resource(CheckSession, '/check')

#Cart
class GetCart(Resource):
    def get(self):
        cartlist = []
        for cart in Cart.query.all():
            template = {
                'id': cart.id,
                'name': cart.name,
                'paid': cart.paid,
                'items': cart.get_items()
            }
            cartlist.append(cart.to_dict())
        resp = make_response(cartlist, 200)
        return resp
    def post(self):
        new = Cart(
            name = request.get_json()['name'],
            user_id = request.get_json()['user_id']
        )
        db.session.add(new)
        try:
            db.session.commit()
            resp = make_response(new.to_dict(), 201)
            return resp
        except:
            resp=make_response({'error':'Cart not added'}, 400)
api.add_resource(GetCart, '/cart')

class GetCartById(Resource):
    def get(self, id):
        target = Cart.query.filter(Cart.id == id).first()
        resp = make_response(target.to_dict(), 200)
        return resp
    def patch(self, id):
        data = request.get_json()
        target = Cart.query.filter(Cart.id == id).first()
        if target == None:
            resp = make_response({"error":"Cart Not Found"}, 404)
            return resp
        else:
            for attr in data:
                setattr(target, attr, data[attr])
            db.session.add(target)
            db.session.commit()
            resp = make_response(target.to_dict(), 200)
            return resp
    def delete(self, id):
        target = Cart.query.filter(Cart.id == id).first()
        if target == None:
            resp = make_response({"error":"Cart Not Found"}, 404)
            return resp
        else:
            db.session.delete(target)
            db.session.commit()
            resp = make_response({}, 204)
            return resp
api.add_resource(GetCartById, '/cart/<int:id>')

class CartByOwner(Resource):
    def get(self, ownerID):
        cartList = []
        for cart in Cart.query.filter(Cart.user_id == ownerID):
            cartList.append(cart.to_dict())
        resp = make_response(cartList, 200)
        return resp
api.add_resource(CartByOwner, '/cartbyowner/<int:ownerID>')

#Item

class GetItem(Resource):
    def get(self):
        itemlist = []
        for item in Item.query.all():
            itemlist.append(item.to_dict())
        resp = make_response(itemlist, 200)
        return resp
    def post(self):
        new = Item(
            title=request.get_json()['title'],
            tags = request.get_json()['tags'],
            price=request.get_json()['price'],
            img=request.get_json()['img'],
            seller_id=request.get_json()['seller_id']
        )
        db.session.add(new)
        try:
            db.session.commit()
            resp = make_response(new.to_dict(), 201)
            return resp
        except:
            resp = make_response({'error':'Item not added'}, 400)
            return resp
api.add_resource(GetItem, '/items', endpoint='items')

class GetItemById(Resource):
    def get(self, id):
        target = Item.query.filter(Item.id == id).first()
        if target == None:
            resp = make_response({"error":"Item not found"}, 404)
            return resp
        else:
            resp = make_response(target.to_dict(), 200)
            return resp
    def patch(self, id):
        target = Item.query.filter(Item.id == id).first()
        if target == None:
            resp = make_response({"error":"Item not found"}, 404)
            return resp
        else:
            data = request.get_json()
            for attr in data:
                setattr(target, attr, data[attr])
            db.session.add(target)
            db.session.commit()
            resp = make_response(target.to_dict(), 201)
            return resp
    def delete(self, id):
        target = Item.query.filter(Item.id == id).first()
        if target == None:
            resp = make_response({"error":"Item not found"}, 404)
            return resp
        else:
            db.session.delete(target)
            db.session.commit()
            resp = make_response({},204)
            return resp
api.add_resource(GetItemById, '/items/<int:id>')

#CartItem

class GetCartItem(Resource):
    def get(self):
        cartitemlist = []
        for cartItem in CartItem.query.all():
            cartitemlist.append(cartItem.to_dict())
        resp = make_response(cartitemlist, 200)
        return resp
    def post(self):
        new = CartItem(
            quantity = request.get_json()['quantity'],
            cart_id = request.get_json()['cart_id'],
            item_id = request.get_json()['item_id']
        )
        db.session.add(new)
        try:
            db.session.commit()
            resp = make_response(new.to_dict(), 201)
            return resp
        except:
            resp = make_response({'error':'Item not added to cart'}, 400)
            return resp
api.add_resource(GetCartItem, '/cart_items')

class GetCartItemById(Resource):
    def get(self, id):
        target = CartItem.query.filter(CartItem.id == id).first()
        if target == None:
            resp = make_response({"error":"Item not found"}, 404)
            return resp
        else:
            resp = make_response(target.to_dict(), 200)
            return resp
    def patch(self, id):
        target = CartItem.query.filter(CartItem.id == id).first()
        if target == None:
            resp = make_response({"error":"Item not found"}, 404)
            return resp
        else:
            data = request.get_json()
            for attr in data:
                setattr(target, attr, data[attr])
            db.session.add(target)
            db.session.commit()
            resp = make_response(target.to_dict(), 201)
            return resp
    def delete(self, id):
        target = CartItem.query.filter(CartItem.id == id).first()
        if target == None:
            resp = make_response({"error":"Item not found in cart"}, 404)
            return resp
        else:
            db.session.delete(target)
            db.session.commit()
            resp = make_response({},204)
            return resp
api.add_resource(GetCartItemById, '/cart_items/<int:id>')

class GetCIIDByCandI(Resource):
    def get(self, cart, item):
        target = CartItem.query.filter(CartItem.cart_id == cart, CartItem.item_id == item).first()
        if target == None:
            return {'error':'nothing found'}, 404
        resp = make_response(jsonify(target.id), 200) 
        return resp
api.add_resource(GetCIIDByCandI, '/getCIID/<int:cart>/<int:item>')

#user

class GetUser(Resource):
    def get(self):
        userlist = []
        for user in User.query.all():
            userlist.append(user.to_dict())
        resp = make_response(userlist, 200)
        return resp
    def post(self):
        new = User(
            name = request.get_json()['name'],
            age = request.get_json()['age'],
            username = request.get_json()['username'],
            email = request.get_json()['email'],
            password = request.get_json()['password'],
            account_type = request.get_json()['type']
        )
        db.session.add(new)
        try:
            db.session.commit()
            resp = make_response(new.to_dict(), 201)
            return resp
        except:
            resp=make_response({'error':'User not added'}, 400)
api.add_resource(GetUser, '/users')

class GetUserByID(Resource):
    def get(self, id):
        target = User.query.filter(User.id == id).first()
        if target == None:
            resp = make_response({"error":"User not found"}, 404)
            return resp
        else:
            resp = make_response(target.to_dict(), 200)
            return resp
    def patch(self, id):
        target = User.query.filter(User.id == id).first()
        if target == None:
            resp = make_response({"error":"User not found"}, 404)
            return resp
        else:
            data = request.get_json()
            for attr in data:
                setattr(target, attr, data[attr])
            db.session.add(target)
            db.session.commit()
            resp = make_response(target.to_dict(), 201)
            return resp
    def delete(self, id):
        target = User.query.filter(User.id == id).first()
        if target == None:
            resp = make_response({"error":"User not found"}, 404)
            return resp
        else:
            db.session.delete(target)
            db.session.commit()
            resp = make_response({},204)
            return resp
api.add_resource(GetUserByID, '/users/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)