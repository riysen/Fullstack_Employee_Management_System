from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse
from django.views.generic import RedirectView

# Root endpoint
def api_root(request):
    return JsonResponse({
        'message': 'Employee Management System API',
        'endpoints': {
            'admin': '/admin/',
            'api_token': '/api/token/',
            'api_token_refresh': '/api/token/refresh/',
            'employees': '/api/employees/',
            'employees_statistics': '/api/employees/statistics/',
        },
        'status': 'running',
    })

urlpatterns = [
    path('', api_root, name='api-root'),  # Root URL
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/employees/', include('employees.urls')),
]