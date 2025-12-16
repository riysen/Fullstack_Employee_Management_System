from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'department', 'role', 'status', 'joining_date', 'performance_score', 'is_archived']
    list_filter = ['department', 'status', 'is_archived', 'joining_date']
    search_fields = ['name', 'email', 'role']
    date_hierarchy = 'joining_date'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'email', 'department', 'role')
        }),
        ('Employment Details', {
            'fields': ('joining_date', 'status', 'performance_score')
        }),
        ('Archive Status', {
            'fields': ('is_archived',)
        }),
    )