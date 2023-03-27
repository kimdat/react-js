import React from 'react';
import NavLink from '../NavLink/index.jsx';
import styles from './NavItem.module.scss';
import Dropdown from '../../../../components/common/Dropdown/index.jsx';
import SubMenu from '../SubMenu/index.jsx';

const NavItem = (props) => {
    const { text, url, icon, navigations } = props;
    return (
        <li className={styles.navItem}>
            {!navigations &&
                <NavLink text={text} url={url} />
            }
            {navigations &&
                <Dropdown
                    toggle={<NavLink text={text} icon={icon} isToggle />}
                    content={<SubMenu navigations={navigations} />}
                />
            }
        </li>
    );
}

export default NavItem;