import React from "react";
import {
  Avatar,
  Button,
  Divider,
  Input,
  Form,
  Typography,
  Space,
  Select,
  DatePicker,
  Upload,
  message,
} from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Account() {
  const onFinish = (values: any) => {
    console.log("Received values:", values);
    message.success("Account information updated successfully!");
  };

  const uploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info: any) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="p-8">
      <Title level={2}>Account Information</Title>
      <Divider />

      <Form name="account-form" layout="vertical" onFinish={onFinish}>
        <Form.Item name="avatar" label="Avatar">
          <Avatar size={64} icon={<UserOutlined />} />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="fullname"
          label="Full Name"
          rules={[
            {
              required: true,
              message: "Please enter your full name",
            },
          ]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please enter your email address",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item name="dob" label="Date of Birth">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="gender" label="Gender">
          <Select placeholder="Select gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item name="bio" label="Bio">
          <Input.TextArea
            placeholder="Tell us something about yourself..."
            rows={4}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Information
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
