from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import _AssociationList
from flask.json.provider import JSONProvider
from flask_bcrypt import Bcrypt

class CustomJSONEncoder(JSONProvider):
    def default(self, obj):
        if isinstance(obj, _AssociationList):
            return list(obj)
        return super().default(obj)

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.secret_key='A1B2C3!'


metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db=SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)
CORS(app)
api = Api(app)