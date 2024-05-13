import React, { useEffect, useState } from "react";
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
import ApiService from "./AccountApiService";
import { title } from "process";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

interface UserPatchDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  dateOfBirth?: Date;
  gender?: string;
  bio?: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  gender: string;
  bio: string;
  isActive: boolean;
}

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const responseData = await axios.get("http://localhost:4000/user/1");

        setUser(responseData.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onFinish = (values: UserPatchDto) => {
    console.log("Received values:", values);
    const updateData = async () => {
      try {
        setIsLoading(true);
        const responseData = await axios.patch(
          "http://localhost:4000/user/1",
          values
        );

        console.log(responseData.data);
        setUser(responseData.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    updateData();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <Title level={2}>
        Account Information for {user?.firstName} {user?.lastName}
      </Title>
      <Divider />

      <Form name="account-form" layout="vertical" onFinish={onFinish}>
        <Form.Item name="avatar" label="Avatar">
          <Avatar size={64} icon={<UserOutlined />} />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            {
              required: true,
              message: "Please enter your first name",
            },
          ]}
          initialValue={user?.firstName}
        >
          <Input placeholder="First Name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            {
              required: true,
              message: "Please enter your last name",
            },
          ]}
          initialValue={user?.lastName}
        >
          <Input placeholder="Las Name" />
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
          initialValue={user?.email}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="dob"
          label="Date of Birth"
          // initialValue={user?.dateOfBirth}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="gender" label="Gender" initialValue={user?.gender}>
          <Select placeholder="Select gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item name="bio" label="Bio" initialValue={user?.bio}>
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
