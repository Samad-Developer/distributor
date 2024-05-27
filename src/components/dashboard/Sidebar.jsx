import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  // const menuItems = useSelector((state) => state.menu.menuItems);
  const menuItems = JSON.parse(localStorage.getItem('menuItems'))

  const renderSubMenu = (menuItem) => {
    const childMenus = menuItems.filter((child) => child.Parent_Id === menuItem.MenuId);

    if (childMenus.length > 0) {
      return (
        <Menu.SubMenu key={menuItem.MenuId} title={menuItem.Menu_Name}>
          {childMenus.map((child) => renderSubMenu(child))}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={menuItem.MenuId}>
          <Link  to={menuItem.Menu_URL}>{menuItem.Menu_Name}</Link>
        </Menu.Item>
      );
    }
  };

  return (
    <aside className="w-[200px]">
      <Menu mode="vertical" >
        {menuItems.filter((item) => item.Parent_Id === null && item.Is_Displayed_In_Menu == true).map((item) => renderSubMenu(item))}
      </Menu>
    </aside>
  );
};

export default Sidebar;
