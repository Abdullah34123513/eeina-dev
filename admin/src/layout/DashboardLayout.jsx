import { useRef } from 'react'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
      const sidebarRef = useRef(null);
      return (
            <div className="main-container">
                  <Sidebar ref={sidebarRef} />
                  <div className="main">
                        <Header sidebarRef={sidebarRef} />
                        <Outlet />
                  </div>
            </div>
      );
}

export default DashboardLayout