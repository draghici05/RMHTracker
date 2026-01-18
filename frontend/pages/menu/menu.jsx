import { NavLink, Outlet } from 'react-router-dom';
import './menu.css';

function Menu() {
    return (
        <div className='menu'>
            <aside className='sidebar'>
                <NavLink to='/home' className='logo'>RMHTrack</NavLink>
                <nav className='nav-links'>
                    <NavLink to='/dashboard' className='nav-item'>Dashboard</NavLink>
                     <NavLink to='/events' className='nav-item'>Events</NavLink>
                    <NavLink to='/attendance' className='nav-item'>Profile</NavLink>
                    <NavLink to='/login' className='nav-logout'>Logout</NavLink>
                </nav>
            </aside>
            <main className='main'>
                <Outlet />
            </main>
        </div>
    )
}

export default Menu;