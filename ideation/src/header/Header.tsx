import React, { useState } from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

function handleClick(e: any) {
  console.log("click", e);
}

// TODO add collections to menu disebar (or at least add Favourite collection)
// TODO image lab: how to understand if background replacement or style transfering?

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const menu = (
    <Menu onClick={handleClick} style={{ width: 256 }} mode="inline">
      <Menu.Item key="1">
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/gallery">Gallery</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/lab">Image Lab</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/account">Account</Link>
      </Menu.Item>
      <SubMenu
        key="sub2"
        title={
          <span>
            <span>Settings</span>
          </span>
        }
      >
        <Menu.Item key="5">Option 5</Menu.Item>
        <Menu.Item key="6">Option 6</Menu.Item>
        <SubMenu key="sub3" title="Submenu">
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </SubMenu>
      </SubMenu>
      <SubMenu
        key="sub4"
        title={
          <span>
            <span>Collections</span>
          </span>
        }
      >
        <Menu.Item key="9">Favourite</Menu.Item>
        {/* <Menu.Item key="10">Option 10</Menu.Item> */}
        {/* <Menu.Item key="11">Option 11</Menu.Item> */}
        {/* <Menu.Item key="12">Option 12</Menu.Item> */}
      </SubMenu>
    </Menu>
  );

  return (
    <div className="flex relative">
      {showMenu && (
        <aside className="bg-gray-800 text-white w-64 h-full absolute left-0 top-0 z-50">
          <div className="h-16 flex items-center justify-between p-4">
            <div>Logo</div>
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
        <Dropdown overlay={menu} trigger={["click"]}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            Menu <DownOutlined />
          </a>
        </Dropdown>
      </header>
    </div>
  );
}
