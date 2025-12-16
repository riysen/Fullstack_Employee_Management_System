import React, { useState, useEffect } from 'react';
import { 
  Layout, Button, Typography, Space, message, Statistic, Row, Col, Card,
  Badge, Tooltip
} from 'antd';
import { 
  LogoutOutlined, PlusOutlined, TeamOutlined, 
  UserDeleteOutlined, LineChartOutlined, CloudOutlined,
  DatabaseOutlined, ClearOutlined
} from '@ant-design/icons';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
// ===== CHANGE 1: Import থেকে hybridAPI use করুন =====
import { hybridEmployeeAPI as employeeAPI, userPreferences } from '../services/hybridAPI';

const { Header, Content } = Layout;
const { Title } = Typography;

const Dashboard = ({ setIsAuthenticated }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // ===== CHANGE 2: নতুন state variables add করুন =====
  const [fromCache, setFromCache] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: userPreferences.getPageSize() || 10, // localStorage থেকে load
    total: 0,
  });
  
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    show_archived: false,
    ordering: userPreferences.getSortOrder() || '-created_at', // localStorage থেকে load
  });
  
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchStatistics();
  }, [pagination.current, pagination.pageSize, filters]);

  // ===== CHANGE 3: Preferences save করুন =====
  useEffect(() => {
    userPreferences.saveSortOrder(filters.ordering);
  }, [filters.ordering]);

  useEffect(() => {
    userPreferences.savePageSize(pagination.pageSize);
  }, [pagination.pageSize]);

  // ===== CHANGE 4: fetchEmployees update করুন =====
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        page_size: pagination.pageSize,
        search: filters.search || undefined,
        department: filters.department || undefined,
        status: filters.status || undefined,
        show_archived: filters.show_archived,
        ordering: filters.ordering,
      };

      const response = await employeeAPI.getAll(params);
      
      setEmployees(response.data.results);
      setPagination({
        ...pagination,
        total: response.data.count,
      });
      
      // Cache indicator
      setFromCache(response.fromCache || false);
      setIsOffline(response.offline || false);
      
      if (response.fromCache) {
        message.info('📦 Loaded from cache (faster!)');
      }
      
      if (response.offline) {
        message.warning('⚠️ Offline mode - showing cached data');
      }

      // Save recent search
      if (filters.search) {
        userPreferences.saveRecentSearch(filters.search);
      }
      
    } catch (error) {
      message.error('Failed to fetch employees');
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await employeeAPI.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics');
    }
  };

  // ===== CHANGE 5: Clear cache handler add করুন =====
  const handleClearCache = () => {
    employeeAPI.clearAllCache();
    message.success('✅ Cache cleared! Refreshing data...');
    fetchEmployees();
    fetchStatistics();
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    message.success('Logged out successfully');
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalVisible(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingEmployee) {
        await employeeAPI.update(editingEmployee.id, values);
        message.success('Employee updated successfully');
      } else {
        await employeeAPI.create(values);
        message.success('Employee added successfully');
      }
      setIsModalVisible(false);
      fetchEmployees();
      fetchStatistics();
    } catch (error) {
      message.error(
        error.response?.data?.message || 
        'Operation failed. Please check your input.'
      );
      throw error;
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await employeeAPI.delete(id);
      message.success('Employee deleted successfully');
      fetchEmployees();
      fetchStatistics();
    } catch (error) {
      message.error('Failed to delete employee');
    }
  };

  const handleArchiveEmployee = async (id) => {
    try {
      await employeeAPI.archive(id);
      message.success('Employee archived successfully');
      fetchEmployees();
      fetchStatistics();
    } catch (error) {
      message.error('Failed to archive employee');
    }
  };

  const handleUnarchiveEmployee = async (id) => {
    try {
      await employeeAPI.unarchive(id);
      message.success('Employee unarchived successfully');
      fetchEmployees();
      fetchStatistics();
    } catch (error) {
      message.error('Failed to unarchive employee');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ===== CHANGE 6: Header এ cache indicators add করুন ===== */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            <TeamOutlined /> Employee Management System
          </Title>
          
          {/* Cache Indicator */}
          {fromCache && (
            <Tooltip title="Data loaded from cache">
              <Badge count="Cache" style={{ backgroundColor: '#52c41a' }}>
                <DatabaseOutlined style={{ fontSize: 20, color: '#52c41a' }} />
              </Badge>
            </Tooltip>
          )}
          
          {/* Offline Indicator */}
          {isOffline && (
            <Tooltip title="Offline mode - showing cached data">
              <Badge count="Offline" style={{ backgroundColor: '#faad14' }}>
                <CloudOutlined style={{ fontSize: 20, color: '#faad14' }} />
              </Badge>
            </Tooltip>
          )}
        </div>
        
        <Space>
          {/* Clear Cache Button */}
          <Tooltip title="Clear cache and refresh">
            <Button 
              icon={<ClearOutlined />}
              onClick={handleClearCache}
            >
              Clear Cache
            </Button>
          </Tooltip>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddEmployee}
          >
            Add Employee
          </Button>
          
          <Button 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        {/* Statistics Cards */}
        {statistics && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Employees"
                  value={statistics.total_employees}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Archived"
                  value={statistics.archived_employees}
                  prefix={<UserDeleteOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Departments"
                  value={Object.keys(statistics.by_department).length}
                  prefix={<LineChartOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Active Status"
                  value={statistics.by_status.Active || 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Employee List */}
        <Card>
          <EmployeeList
            employees={employees}
            loading={loading}
            pagination={pagination}
            filters={filters}
            onPaginationChange={setPagination}
            onFiltersChange={setFilters}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
            onArchive={handleArchiveEmployee}
            onUnarchive={handleUnarchiveEmployee}
          />
        </Card>
      </Content>

      {/* Employee Form Modal/Drawer */}
      <EmployeeForm
        visible={isModalVisible}
        employee={editingEmployee}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsModalVisible(false)}
      />
    </Layout>
  );
};

export default Dashboard;