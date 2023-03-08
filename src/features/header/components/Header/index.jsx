import React from 'react';
import NavItem from '../NavItem/index.jsx';
import NavLogo from '../NavLogo/index.jsx';
import HamburgerIcon from '../../../../assets/HamburgerIcon.jsx';
import styles from './Header.module.scss';
import SideNav from '../SideNav/index.jsx';
import useDeviceDetect from '../../../../hooks/useDeviceDetect';
import NavProfile from '../NavProfile/index.jsx';

const Header = (props) => {
    const { isMobile, isDesktop } = useDeviceDetect();
    const { logo, navigations, profile } = props;
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerWrapper}>
                <nav className={styles.nav}>
                    <SideNav trigger={
                        <button className={styles.headerSideNavToggle}>
                            <HamburgerIcon color="#777" />
                        </button>
                    } navigations={navigations} isHandheld={isMobile} />

                    <ul className={styles.navGroup}>
                        <NavLogo {...logo}></NavLogo>
                        {isDesktop && navigations.map((item, idx) => <NavItem key={idx} {...item}></NavItem>)}
                    </ul>

                    <NavProfile {...profile}></NavProfile>
                </nav>
            </div>
        </header>
    );
}

export default Header;