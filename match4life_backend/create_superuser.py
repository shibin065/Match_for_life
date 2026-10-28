import os
import django
import sys

sys.path.append('C:\\Users\\bibin\\Desktop\\project ap\\match4life_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

def create_demo_superuser():
    username = 'demo_admin'
    email = 'demo.admin@match4life.com'
    password = 'Admin@12345'
    
    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser {username}...")
        User.objects.create_superuser(username, email, password)
        print("Superuser created successfully!")
    else:
        print(f"Superuser {username} already exists.")
        
        # Ensure password is correct anyway
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
        print("Password updated successfully.")

if __name__ == '__main__':
    create_demo_superuser()
