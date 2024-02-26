import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SideMenu() {
    const menuItems = [
        {
            name: 'Profile',
            url: '/me/profile',
            icon: 'fas fa-user'
        },
        {
            name: 'Update Profile',
            url: '/me/update_profile',
            icon: 'fas fa-user'
        },
        {
            name: 'Upload Avatar',
            url: '/me/upload_avatar',
            icon: 'fas fa-user-circle'
        },
        {
            name: 'Update Password',
            url: '/me/update_password',
            icon: 'fas fa-lock'
        }
    ];
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(location.pathname);
    const handleMenuItemClick = url => setActiveMenu(url);
  return (
    <div className="list-group mt-5 pl-4">
   {menuItems.map((menuItem, index) => <Link
   key={index}
   to={menuItem.url}
    className={`fw-bold list-group-item list-group-item-action ${activeMenu?.includes(menuItem.url) ? 'active' : ''}`}
    onClick={() => handleMenuItemClick(menuItem.url)}
    >
      <i className={`${menuItem.icon} fa-fw pe-2`}></i>{menuItem.name}
    </Link>)}
  </div>
  );
}
