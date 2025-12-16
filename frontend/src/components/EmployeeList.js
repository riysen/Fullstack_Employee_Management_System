import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Space, Button, Input, Select, DatePicker, 
  Switch, Popconfirm, Progress, Empty, Row, Col, Card as AntCard,
  Tooltip
} from 'antd';
import {
  EditOutlined, DeleteOutlined, SearchOutlined,
  InboxOutlined, AppstoreOutlined, UnorderedListOutlined,
  FilterOutlined
} from '@ant-design/icons';
import EmployeeCard from './EmployeeCard';

const { RangePicker } = DatePicker;
const { Option } = Select;

const EmployeeList = ({
  employees,
  loading,
  pagination,
  filters,
  onPaginationChange,
  onFiltersChange,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
}) => {
  const [viewMode, setViewMode] = useState('table');
  const [searchDebounce, setSearchDebounce] = useState(null);
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounced search
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timeout = setTimeout(() => {
      onFiltersChange({ ...filters, search: localSearch });
    }, 500);

    setSearchDebounce(timeout);

    return () => clearTimeout(timeout);
  }, [localSearch]);

  // Save sort order to localStorage
  useEffect(() => {
    localStorage.setItem('employee_sort_order', filters.ordering);
  }, [filters.ordering]);

  // Load sort order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('employee_sort_order');
    if (savedOrder) {
      onFiltersChange({ ...filters, ordering: savedOrder });
    }
  }, []);

  const statusColors = {
    active: 'green',
    inactive: 'red',
    on_leave: 'orange',
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: filters.ordering === 'name' ? 'ascend' : 
                 filters.ordering === '-name' ? 'descend' : null,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: true,
      sortOrder: filters.ordering === 'department' ? 'ascend' : 
                 filters.ordering === '-department' ? 'descend' : null,
      render: (dept) => dept.replace('_', ' ').toUpperCase(),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Joining Date',
      dataIndex: 'joining_date',
      key: 'joining_date',
      sorter: true,
      sortOrder: filters.ordering === 'joining_date' ? 'ascend' : 
                 filters.ordering === '-joining_date' ? 'descend' : null,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Performance',
      dataIndex: 'performance_score',
      key: 'performance_score',
      sorter: true,
      sortOrder: filters.ordering === 'performance_score' ? 'ascend' : 
                 filters.ordering === '-performance_score' ? 'descend' : null,
      render: (score) => (
        <Progress 
          percent={score} 
          size="small" 
          status={score >= 70 ? 'success' : score >= 40 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          
          {record.is_archived ? (
            <Tooltip title="Unarchive">
              <Button
                type="default"
                size="small"
                onClick={() => onUnarchive(record.id)}
              >
                Unarchive
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Archive">
              <Popconfirm
                title="Are you sure you want to archive this employee?"
                onConfirm={() => onArchive(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="default" size="small">
                  Archive
                </Button>
              </Popconfirm>
            </Tooltip>
          )}
          
          <Tooltip title="Delete Permanently">
            <Popconfirm
              title="Are you sure you want to delete this employee?"
              onConfirm={() => onDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    onPaginationChange({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });

    if (sorter.field) {
      const order = sorter.order === 'ascend' ? 
        sorter.field : `-${sorter.field}`;
      onFiltersChange({ ...filters, ordering: order });
    }
  };

  return (
    <div>
      {/* Filters Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="Search employees..."
            prefix={<SearchOutlined />}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            allowClear
          />
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Select
            placeholder="Department"
            style={{ width: '100%' }}
            value={filters.department || undefined}
            onChange={(value) => onFiltersChange({ ...filters, department: value })}
            allowClear
          >
            <Option value="engineering">Engineering</Option>
            <Option value="marketing">Marketing</Option>
            <Option value="sales">Sales</Option>
            <Option value="hr">Human Resources</Option>
            <Option value="finance">Finance</Option>
            <Option value="operations">Operations</Option>
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Select
            placeholder="Status"
            style={{ width: '100%' }}
            value={filters.status || undefined}
            onChange={(value) => onFiltersChange({ ...filters, status: value })}
            allowClear
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="on_leave">On Leave</Option>
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Space>
            <span>Show Archived:</span>
            <Switch
              checked={filters.show_archived}
              onChange={(checked) => onFiltersChange({ ...filters, show_archived: checked })}
            />
          </Space>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={4}>
          <Space>
            <Button
              icon={viewMode === 'table' ? <AppstoreOutlined /> : <UnorderedListOutlined />}
              onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
            >
              {viewMode === 'table' ? 'Card View' : 'Table View'}
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Content Section */}
      {employees.length === 0 && !loading ? (
        <Empty
          image={<InboxOutlined style={{ fontSize: 80, color: '#ccc' }} />}
          description={
            <span style={{ fontSize: 16, color: '#999' }}>
              No employees found. {filters.show_archived ? 'Try switching to active employees.' : 'Add your first employee!'}
            </span>
          }
        />
      ) : viewMode === 'table' ? (
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} employees`,
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {employees.map((employee) => (
              <Col xs={24} sm={12} md={8} lg={6} key={employee.id}>
                <EmployeeCard
                  employee={employee}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onArchive={onArchive}
                  onUnarchive={onUnarchive}
                />
              </Col>
            ))}
          </Row>
          
          {/* Pagination for Card View */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Space>
              <Button
                disabled={pagination.current === 1}
                onClick={() => onPaginationChange({ ...pagination, current: pagination.current - 1 })}
              >
                Previous
              </Button>
              <span>Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}</span>
              <Button
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                onClick={() => onPaginationChange({ ...pagination, current: pagination.current + 1 })}
              >
                Next
              </Button>
            </Space>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeList;