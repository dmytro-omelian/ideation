import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function Login() {
  const [form] = Form.useForm();
  const { login, token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      message.success("Successfully signed in!");
      navigate("/");
    } catch (error) {
      message.error("Email or password is wrong");
    }
  };

  if (token != null) {
    navigate("/");
  }

  return (
    <div className="flex h-screen bg-gray-100 justify-center items-center">
      <div className="p-8 shadow-lg rounded-lg bg-white w-[30%]">
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
