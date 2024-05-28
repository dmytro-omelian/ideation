import React, { useEffect, useRef, useState } from "react";
import { Menu, Dropdown, Tooltip, Typography } from "antd";
import {
  QuestionCircleOutlined,
  HomeOutlined,
  PictureOutlined,
  ExperimentOutlined,
  UserOutlined,
  SettingOutlined,
  CloseOutlined,
  MenuOutlined,
  AntDesignOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

const { SubMenu } = Menu;

function handleClick(e: any) {
  console.log("click", e);
}

// TODO add collections to menu sidebar (or at least add Favourite collection)
// TODO image lab: how to understand if background replacement or style transfering?

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const { user: authorizedUser, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const menuElement = document.getElementById("menu");
      if (
        menuElement &&
        event.target instanceof Node &&
        !menuElement.contains(event.target)
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSupportClick = () => {
    window.location.href =
      "mailto:omeluan.dima@gmail.com?subject=Support Request";
  };

  const handleOnLogoutClick = () => {
    if (authorizedUser) {
      logout();
    }
  };

  const menu = (
    <Menu
      id="menu"
      className="border h-screen"
      onClick={handleClick}
      style={{ width: 256 }}
      mode="inline"
    >
      {authorizedUser ? (
        <>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<PictureOutlined />}>
            <Link to="/gallery">Gallery</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<ExperimentOutlined />}>
            <Link to="/lab">Image Lab</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<UserOutlined />}>
            <Link to="/account">Account</Link>
          </Menu.Item>
          <SubMenu
            key="sub4"
            title={
              <span>
                <span>Collections</span>
              </span>
            }
          >
            <Menu.Item key="9" icon={<PictureOutlined />}>
              <Link to="/favourite">Favourite</Link>
            </Menu.Item>
            <Menu.Item key="10" disabled icon={<QuestionCircleOutlined />}>
              <Tooltip title="Coming soon">
                <span>Collection Builder</span>
              </Tooltip>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <span>Settings</span>
              </span>
            }
          >
            <Menu.Item
              key="6"
              icon={<QuestionCircleOutlined />}
              onClick={handleSupportClick}
            >
              Support
            </Menu.Item>
            <Menu.Item
              key="7"
              icon={<UserOutlined />}
              onClick={handleOnLogoutClick}
            >
              Log out
            </Menu.Item>
          </SubMenu>
        </>
      ) : (
        <Menu.Item key="login" icon={<LoginOutlined />}>
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="flex relative">
      {showMenu && (
        <aside className="bg-white text-black w-64 h-full absolute left-0 top-0 z-50">
          <div className="h-16 flex items-center justify-between p-4">
            <div>
              <AntDesignOutlined className="mr-1" />
              <Typography.Text>[ideation]</Typography.Text>
            </div>
            <CloseOutlined
              className="text-xl cursor-pointer"
              onClick={() => setShowMenu(false)}
            />
          </div>{" "}
          {menu}
        </aside>
      )}
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white w-full">
        <div>
          <MenuOutlined
            onClick={() => setShowMenu(!showMenu)}
            className="text-2xl cursor-pointer"
          />
        </div>
      </header>
    </div>
  );
}
