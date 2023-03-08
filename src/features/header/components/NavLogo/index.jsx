import React from 'react';
import styles from './NavLogo.module.scss';

const NavLogo = (props) => {
    const { logoUrl, url, title = "CTIN" } = props;
    return (
        <li className={styles.navLogo}>
            <a href={url} title={title} className={styles.navLogoLink}>
                <img src={logoUrl} alt={title}></img>
            </a>
        </li>
    );
}

export default NavLogo;