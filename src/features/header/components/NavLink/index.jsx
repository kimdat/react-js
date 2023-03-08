import React from 'react';
import styles from './NavLink.module.scss';

const NavLink = (props) => {
    const { text, url, icon, isToggle } = props;
    return (
        <a className={styles.navLink}
            href={url ? url : "#"}>
            {icon &&
                <span className={styles.navLinkIcon}>{icon}</span>
            }
            <span className={
                `${styles.navLinkText} ${isToggle ? styles.navLinkToggle : ''}`
            }>
                {text}
            </span>
        </a>
    );
}

export default NavLink;