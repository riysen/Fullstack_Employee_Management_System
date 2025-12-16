import React from 'react';
import { Card, Tag, Button, Space, Popconfirm, Progress, Avatar, Typography } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const EmployeeCard = ({ employee, onEdit, onDelete, onArchive, onUnarchive }) => {
  const statusColors = {
    active: 'green',
    inactive: 'red',
    on_leave: 'orange',
  };

  const departmentColors = {
    engineering: '#1890ff',
    marketing: '#52c41a',
    sales: '#faad14',
    hr: '#722ed1',
    finance: '#eb2f96',
    operations: '#13c2c2',
  };

  return (
    <Card
      hoverable
      style={{
        borderRadius: 8,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}
      actions={[
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(employee)}
        >
          Edit
        </Button>,
        employee.is_archived ? (
          <Button
            type="text"
            onClick={() => onUnarchive(employee.id)}
          >
            Unarchive
          </Button>
        ) : (
          <Popconfirm
            title="Archive this employee?"
            onConfirm={() => onArchive(employee.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text">Archive</Button>
          </Popconfirm>
        ),
        <Popconfirm
          title="Delete permanently?"
          onConfirm={() => onDelete(employee.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>,
      ]}
    >
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Avatar
          size={64}
          icon={<UserOutlined />}
          style={{
            backgroundColor: departmentColors[employee.department] || '#1890ff',
            marginBottom: 8,
          }}
        />
        <Typography.Title level={5} style={{ marginBottom: 4 }}>
          {employee.name}
        </Typography.Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {employee.role}
        </Text>
      </div>

      <Space direction="vertical" size="small" style={{ width: '100%', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MailOutlined style={{ color: '#999' }} />
          <Text ellipsis style={{ flex: 1, fontSize: 12 }}>
            {employee.email}
          </Text>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TeamOutlined style={{ color: '#999' }} />
          <Tag color={departmentColors[employee.department]}>
            {employee.department.replace('_', ' ').toUpperCase()}
          </Tag>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarOutlined style={{ color: '#999' }} />
          <Text style={{ fontSize: 12 }}>Joined: {employee.joining_date}</Text>
        </div>

        <div style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>
            Status:
          </Text>
          <Tag color={statusColors[employee.status]}>
            {employee.status.replace('_', ' ').toUpperCase()}
          </Tag>
          {employee.is_archived && (
            <Tag color="default">ARCHIVED</Tag>
          )}
        </div>

        <div style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>
            Performance Score:
          </Text>
          <Progress
            percent={employee.performance_score}
            size="small"
            status={
              employee.performance_score >= 70
                ? 'success'
                : employee.performance_score >= 40
                ? 'normal'
                : 'exception'
            }
          />
        </div>
      </Space>
    </Card>
  );
};

export default EmployeeCard;