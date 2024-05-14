import React, { useEffect, useRef, useState } from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

function handleClick(e: any) {
  console.log("click", e);
}

// TODO add collections to menu sidebar (or at least add Favourite collection)
// TODO image lab: how to understand if background replacement or style transfering?

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

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

  const menu = (
    <Menu
      id="menu"
      className="border h-screen"
      onClick={handleClick}
      style={{ width: 256 }}
      mode="inline"
    >
      <Menu.Item key="1">
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/gallery">Gallery</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/lab">Image Lab</Link>
      </Menu.Item>
      <Menu.Item key="4">
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
        <Menu.Item key="9">
          <Link to="/favourite">Favourite</Link>
        </Menu.Item>
        {/* <Menu.Item key="10">Option 10</Menu.Item> */}
        {/* <Menu.Item key="11">Option 11</Menu.Item> */}
        {/* <Menu.Item key="12">Option 12</Menu.Item> */}
      </SubMenu>
      <SubMenu
        key="sub2"
        title={
          <span>
            <span>Settings</span>
          </span>
        }
      >
        <Menu.Item key="5">Configuration</Menu.Item>
        <Menu.Item key="6">Support</Menu.Item>
        <Menu.Item key="6">Log out</Menu.Item>
      </SubMenu>
    </Menu>
  );

  return (
    <div className="flex relative">
      {showMenu && (
        <aside className="bg-white text-black w-64 h-full absolute left-0 top-0 z-50">
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
      </header>
    </div>
  );
}
