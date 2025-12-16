import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  InputNumber,
  message,
} from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const EmployeeForm = ({ visible, employee, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [continueEditing, setContinueEditing] = useState(false);

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        ...employee,
        joining_date: employee.joining_date ? dayjs(employee.joining_date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [employee, form, visible]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        joining_date: values.joining_date.format('YYYY-MM-DD'),
      };

      await onSubmit(formattedValues);

      if (continueEditing) {
        message.success('Saved! You can continue editing.');
        setContinueEditing(false);
      } else {
        form.resetFields();
      }
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndContinue = () => {
    setContinueEditing(true);
    form.submit();
  };

  const disableFutureDates = (current) => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <Drawer
      title={employee ? 'Edit Employee' : 'Add New Employee'}
      width={600}
      onClose={onCancel}
      open={visible}
      bodyStyle={{ paddingBottom: 80 }}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            Cancel
          </Button>
          <Button onClick={handleSaveAndContinue} loading={loading}>
            Save & Continue
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            icon={<SaveOutlined />}
          >
            {employee ? 'Update' : 'Create'}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark="optional"
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: 'Please enter employee name' },
            { min: 2, message: 'Name must be at least 2 characters' },
          ]}
        >
          <Input placeholder="Enter full name" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter email address' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="employee@company.com" size="large" />
        </Form.Item>

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: 'Please select a department' }]}
        >
          <Select placeholder="Select department" size="large">
            <Option value="engineering">Engineering</Option>
            <Option value="marketing">Marketing</Option>
            <Option value="sales">Sales</Option>
            <Option value="hr">Human Resources</Option>
            <Option value="finance">Finance</Option>
            <Option value="operations">Operations</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="role"
          label="Job Role"
          rules={[
            { required: true, message: 'Please enter job role' },
            { min: 2, message: 'Role must be at least 2 characters' },
          ]}
        >
          <Input placeholder="e.g., Senior Software Engineer" size="large" />
        </Form.Item>

        <Form.Item
          name="joining_date"
          label="Joining Date"
          rules={[
            { required: true, message: 'Please select joining date' },
            {
              validator: (_, value) => {
                if (value && value > dayjs()) {
                  return Promise.reject('Joining date cannot be in the future');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            size="large"
            format="YYYY-MM-DD"
            disabledDate={disableFutureDates}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Employment Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status" size="large">
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="on_leave">On Leave</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="performance_score"
          label="Performance Score (1-100)"
          rules={[
            { required: true, message: 'Please enter performance score' },
            {
              type: 'number',
              min: 1,
              max: 100,
              message: 'Score must be between 1 and 100',
            },
          ]}
          initialValue={50}
        >
          <InputNumber
            style={{ width: '100%' }}
            size="large"
            min={1}
            max={100}
            placeholder="Enter score (1-100)"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EmployeeForm;