import React from 'react';
import styles from './SideNavSubMenu.module.scss';

const SideNavSubMenuItem = (props) => {
    const { text, url, icon } = props;
    return (
        <li className={styles.sideNavSubMenuItem}>
            <a className={styles.sideNavSubMenuLink} href={url}>
                <span className={styles.sideNavSubMenuIcon}>{icon}</span>
                {text}
            </a>
        </li>
    );
}

const SideNavSubMenu = (props) => {
    const { navigations } = props;

    return (
        <div className={styles.sideNavSubMenu}>
            <ul className={styles.sideNavSubMenuList}>
                {navigations.map((item, idx) =>
                    <SideNavSubMenuItem key={idx} {...item} />
                )}
            </ul>
        </div>
    );
}

export default SideNavSubMenu;