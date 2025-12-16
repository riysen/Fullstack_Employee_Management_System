from rest_framework import serializers
from .models import Employee
from django.utils import timezone

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id', 'name', 'email', 'department', 'role', 
            'joining_date', 'status', 'performance_score', 
            'is_archived', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_joining_date(self, value):
        if value > timezone.now().date():
            raise serializers.ValidationError("Joining date cannot be in the future.")
        return value
    
    def validate_performance_score(self, value):
        if value < 1 or value > 100:
            raise serializers.ValidationError("Performance score must be between 1 and 100.")
        return value
    
    def validate_email(self, value):
        # Check for unique email (excluding current instance in update)
        instance = self.instance
        if Employee.objects.filter(email=value).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError("An employee with this email already exists.")
        return value