import React from 'react';
import styles from './SubMenu.module.scss';

const SubMenuItem = (props) => {
    const { text, url, icon } = props;
    return (
        <li className={styles.subMenuItem}>
            <a href={url}>
                <span className={styles.subMenuItemIcon}>{icon}</span>
                {text}
            </a>
        </li>
    );
}

const SubMenu = (props) => {
    const { navigations } = props;
    return (
        <div className={styles.subMenu}>
            <ul className={styles.subMenuItemList}>
                {navigations.map((item, idx) =>
                    <SubMenuItem key={idx} {...item}></SubMenuItem>
                )}
            </ul>
        </div>
    );
}

export default SubMenu;