from sqlalchemy import BigInteger, Column,Integer,SmallInteger, String, ForeignKey, Float, DateTime, Numeric, UniqueConstraint, PrimaryKeyConstraint
import flask
import flask_sqlalchemy
from flask_cors import CORS
from flask import jsonify, make_response, current_app,request,Flask
from datetime import timedelta
from functools import update_wrapper
from sqlalchemy import desc
import re
from sqlalchemy import text, inspect
from sqlalchemy.orm import joinedload, aliased
from sqlalchemy.ext.declarative import declarative_base
import simplejson
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

app = Flask(__name__)

db = flask_sqlalchemy.SQLAlchemy(app)
CORS(app)
# manager = APIManager(app, flask_sqlalchemy_db=db)

Base = declarative_base()
metadata = Base.metadata
origin = '*'

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@127.0.0.1/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_SIZE'] = 10
app.config['SQLALCHEMY_POOL_RECYCLE'] = 55

class User(Base):
    __tablename__='user'
    id=Column(BigInteger, primary_key = True)
    first_name=Column(String(100))
    last_name=Column(String(100))
    age=Column(BigInteger)
    gender=Column(String(100))
    date_joining=Column(String(100))

def add_cors_header(response):
    response.headers['Access-Control-Allow-Origin'] = "*"

def add_cors_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'HEAD, GET, POST, PATCH, PUT, OPTIONS, DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

def crossdomain(origin=None, methods=None, headers=None,
                max_age=100000, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
            #if headers is not None:
            #    h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

BAD_REQUEST = 400

def raiseError(code, message):
    resp = jsonify({'message': message})
    resp.status_code = code
    return resp

@app.route("/",methods=['GET'])
def test():
     return jsonify({'message' : 'It works!'})

@app.route('/users',methods=['GET','POST','OPTIONS'])
@crossdomain(origin=origin)
def Users():
    if request.method == 'GET':
        i_data = db.session.query(User).all()
        print i_data
        data=[]
        for j in i_data:
             a = {}
             a["id"] = j.id
             a["first_name"] = j.first_name
             a["last_name"] = j.last_name
             a["age"] = j.age
             a["gender"] = j.gender
             a["date_joining"] = j.date_joining
             data.append(a)
             print a
        return jsonify({"data" : data})
    else:
        data=request.json
        print "data"
        print data
        x = User()
        x.id = data["id"]
        x.first_name = data["first_name"]
        x.last_name = data["last_name"]
        x.age = data["age"]
        x.gender = data["gender"]
        x.date_joining = data["date_joining"]
        print x
        db.session.add(x)
        db.session.commit()
        return jsonify({"success":"data added!"})

@app.route('/update/users/<id>',methods=['PUT','DELETE','OPTIONS'])
@crossdomain(origin=origin)
def UsersUpdate(id):
    if request.method == 'PUT':
        data = request.json
        print data
        d = data.keys()

        resp = db.session.query(User).filter_by(id = id).update({
        'id' : data['id'],
        'first_name' : data['first_name'],
        'last_name' : data['last_name'],
        'age' : data['age'],
        'gender' : data['gender'],
        'date_joining' : data['date_joining']
        })
        print resp
        db.session.commit()
        return jsonify({"success":"data updated!"})
    else:
        resp = db.session.query(User).filter(User.id == id).delete()
        db.session.commit()
        return jsonify(status="success", message="Entry removed successfully")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0",port=5000)
