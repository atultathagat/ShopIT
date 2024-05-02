import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SideMenu({menuItems}) {
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
