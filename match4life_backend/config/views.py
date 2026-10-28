from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def admin_login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                if user.is_staff or user.is_superuser:
                    login(request, user)
                    return JsonResponse({'success': True, 'message': 'Admin authenticated'})
                else:
                    return JsonResponse({'success': False, 'message': 'User is not an admin'}, status=403)
            else:
                return JsonResponse({'success': False, 'message': 'Invalid username or password'}, status=401)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
