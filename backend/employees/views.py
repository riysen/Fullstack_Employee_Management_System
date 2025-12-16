from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Employee
from .serializers import EmployeeSerializer
from .filters import EmployeeFilter

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    # permission_classes = [IsAuthenticated]  # ⚠️ Commented out for testing
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = EmployeeFilter
    search_fields = ['name', 'email', 'department', 'role', 'status']
    ordering_fields = ['name', 'department', 'joining_date', 'performance_score', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Employee.objects.all()
        
        # Filter by archived status
        show_archived = self.request.query_params.get('show_archived', 'false')
        if show_archived.lower() == 'true':
            queryset = queryset.filter(is_archived=True)
        else:
            queryset = queryset.filter(is_archived=False)
        
        # Global search across multiple fields
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(email__icontains=search) |
                Q(department__icontains=search) |
                Q(role__icontains=search) |
                Q(status__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        employee = self.get_object()
        employee.archive()
        return Response({
            'message': f'{employee.name} has been archived successfully.',
            'data': EmployeeSerializer(employee).data
        })
    
    @action(detail=True, methods=['post'])
    def unarchive(self, request, pk=None):
        employee = self.get_object()
        employee.unarchive()
        return Response({
            'message': f'{employee.name} has been unarchived successfully.',
            'data': EmployeeSerializer(employee).data
        })
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        stats = {
            'total_employees': Employee.objects.filter(is_archived=False).count(),
            'archived_employees': Employee.objects.filter(is_archived=True).count(),
            'by_department': {},
            'by_status': {},
        }
        
        # Count by department
        for dept_code, dept_name in Employee.DEPARTMENT_CHOICES:
            count = Employee.objects.filter(department=dept_code, is_archived=False).count()
            stats['by_department'][dept_name] = count
        
        # Count by status
        for status_code, status_name in Employee.STATUS_CHOICES:
            count = Employee.objects.filter(status=status_code, is_archived=False).count()
            stats['by_status'][status_name] = count
        
        return Response(stats)