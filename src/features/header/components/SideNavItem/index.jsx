import React from 'react';
import Accordion from '../../../../components/common/Accordion';
import SideNavSubMenu from '../SideNavSubMenu';
import styles from './SideNavItem.module.scss';

const SideNavItem = (props) => {
    const { text, url, icon, navigations } = props;
    return (
        <>
            {!navigations &&
                <li className={styles.sideNavItem}>
                    <a className={styles.sideNavLink} href={url}>
                        <span className={styles.sideNavIcon}>{icon ? icon : ''}</span>
                        <span className={styles.sideNavText}>{text}</span>
                    </a>
                </li>
            }
            {navigations &&
                <li className={styles.sideNavItem}>
                    <Accordion header={
                        <a className={styles.sideNavLink} href="#">
                            <span className={styles.sideNavIcon}>{icon ? icon : ''}</span>
                            <span className={styles.sideNavText}>{text}</span>
                        </a>
                    } body={
                        <SideNavSubMenu navigations={navigations} />
                    } />
                </li>
            }
        </>
    );
}

export default SideNavItem;