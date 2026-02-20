from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from functools import wraps
import time

auth_bp = Blueprint('auth', __name__)

# Simple rate limiting (in-memory, for development)
rate_limit_store = {}

def rate_limit(max_requests=5, window=60):
    """Simple rate limiting decorator"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            client_ip = request.remote_addr
            endpoint = request.endpoint
            key = f"{client_ip}:{endpoint}"
            
            current_time = time.time()
            
            # Clean old entries
            if key in rate_limit_store:
                rate_limit_store[key] = [
                    req_time for req_time in rate_limit_store[key]
                    if current_time - req_time < window
                ]
            else:
                rate_limit_store[key] = []
            
            # Check rate limit
            if len(rate_limit_store[key]) >= max_requests:
                return jsonify({
                    'error': 'Too many requests. Please try again later.'
                }), 429
            
            # Record this request
            rate_limit_store[key].append(current_time)
            
            return f(*args, **kwargs)
        return wrapper
    return decorator

@auth_bp.route('/signup', methods=['POST'])
@rate_limit(max_requests=5, window=60)
def signup():
    """User registration endpoint"""
    try:
        # Import here to avoid circular imports
        from main import db, UserModel
        from models.user import User
        
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        username = data.get('username') or data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({
                'error': 'Missing required fields: username, email, and password are required'
            }), 400
        
        # Sanitize inputs
        username = username.strip()
        email = email.strip().lower()
        
        # Validate email format
        if not User.validate_email(email):
            return jsonify({
                'error': 'Invalid email format'
            }), 400
        
        # Validate password complexity
        if not User.validate_password(password):
            return jsonify({
                'error': 'Password must be at least 6 characters with uppercase, lowercase, and a number'
            }), 400
        
        # Check if user already exists
        if UserModel.query.filter_by(username=username).first():
            return jsonify({
                'error': 'Username already exists'
            }), 400
        
        if UserModel.query.filter_by(email=email).first():
            return jsonify({
                'error': 'Email already exists'
            }), 400
        
        # Create new user
        try:
            new_user = UserModel(username=username, email=email, password=password)
            db.session.add(new_user)
            db.session.commit()
            
            return jsonify({
                'message': 'User created successfully',
                'user': new_user.to_dict()
            }), 201
        
        except ValueError as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
        
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'error': 'Failed to create user. Please try again.'
            }), 500
    
    except Exception as e:
        return jsonify({
            'error': 'An error occurred during registration'
        }), 500

@auth_bp.route('/login', methods=['POST'])
@rate_limit(max_requests=5, window=60)
def login():
    """User login endpoint"""
    try:
        # Import here to avoid circular imports
        from main import UserModel
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Accept both username and email for login
        identifier = data.get('username') or data.get('email')
        password = data.get('password')
        
        if not identifier or not password:
            return jsonify({
                'error': 'Username/email and password are required'
            }), 400
        
        # Sanitize input
        identifier = identifier.strip().lower()
        
        # Find user by username or email
        user = UserModel.query.filter(
            (UserModel.username == identifier) | (UserModel.email == identifier)
        ).first()
        
        if not user or not user.check_password(password):
            return jsonify({
                'error': 'Invalid username/email or password'
            }), 401
        
        # Generate JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': 'An error occurred during login'
        }), 500
