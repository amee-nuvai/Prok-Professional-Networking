from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import re

class User:
    """User model for authentication"""
    
    @staticmethod
    def create_model(db):
        """Create User SQLAlchemy model"""
        class UserModel(db.Model):
            __tablename__ = 'users'
            
            id = db.Column(db.Integer, primary_key=True)
            username = db.Column(db.String(80), unique=True, nullable=False, index=True)
            email = db.Column(db.String(120), unique=True, nullable=False, index=True)
            password_hash = db.Column(db.String(255), nullable=False)
            created_at = db.Column(db.DateTime, default=datetime.utcnow)
            
            def __init__(self, username, email, password):
                """Initialize user with hashed password"""
                self.username = username
                self.email = email
                self.set_password(password)
            
            def set_password(self, password):
                """Hash and set password"""
                if not User.validate_password(password):
                    raise ValueError("Password does not meet complexity requirements")
                self.password_hash = generate_password_hash(password)
            
            def check_password(self, password):
                """Verify password against hash"""
                return check_password_hash(self.password_hash, password)
            
            def to_dict(self):
                """Convert user to dictionary (exclude password)"""
                return {
                    'id': self.id,
                    'username': self.username,
                    'email': self.email,
                    'created_at': self.created_at.isoformat() if self.created_at else None
                }
            
            def __repr__(self):
                return f'<User {self.username}>'
        
        return UserModel
    
    @staticmethod
    def validate_password(password):
        """
        Validate password complexity:
        - At least 6 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        """
        if len(password) < 6:
            return False
        if not re.search(r'[A-Z]', password):
            return False
        if not re.search(r'[a-z]', password):
            return False
        if not re.search(r'\d', password):
            return False
        return True
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
