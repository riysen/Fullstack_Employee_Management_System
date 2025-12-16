from django_filters import rest_framework as filters
from .models import Employee

class EmployeeFilter(filters.FilterSet):
    department = filters.ChoiceFilter(choices=Employee.DEPARTMENT_CHOICES)
    status = filters.ChoiceFilter(choices=Employee.STATUS_CHOICES)
    joining_date_from = filters.DateFilter(field_name='joining_date', lookup_expr='gte')
    joining_date_to = filters.DateFilter(field_name='joining_date', lookup_expr='lte')
    performance_min = filters.NumberFilter(field_name='performance_score', lookup_expr='gte')
    performance_max = filters.NumberFilter(field_name='performance_score', lookup_expr='lte')
    
    class Meta:
        model = Employee
        fields = ['department', 'status', 'joining_date_from', 'joining_date_to', 'performance_min', 'performance_max']