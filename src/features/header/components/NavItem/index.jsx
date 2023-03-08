import React from 'react';
import NavLink from '../NavLink/index.jsx';
import styles from './NavItem.module.scss';
import Dropdown from '../../../../components/common/Dropdown/index.jsx';
import SubMenu from '../SubMenu/index.jsx';

const NavItem = (props) => {
    const { text, url, icon, navigations, hasSubMenu } = props;
    return (
        <li className={styles.navItem}>
            {!hasSubMenu &&
                <NavLink text={text} url={url} />
            }
            {hasSubMenu &&
                <Dropdown
                    toggle={<NavLink text={text} icon={icon} isToggle />}
                    subMenu={<SubMenu navigations={navigations} />}
                />
            }
        </li>
    );
}

export default NavItem;