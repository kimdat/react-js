import React from 'react';
import HamburgerMenu from '../../../../components/common/HamburgerMenu';
import SideNavItem from '../SideNavItem';
import styles from './SideNav.module.scss';

const SideNav = (props) => {
    const { trigger, navigations, isHandheld } = props;
    return (
        <>
            {isHandheld &&
                <HamburgerMenu
                    className={styles.sideNav}
                    trigger={trigger}
                    body={
                        <ul className={styles.sideNavList}>
                            {navigations?.map((item, idx) => <SideNavItem key={idx} {...item} />)}
                        </ul>
                    }
                ></HamburgerMenu>
            }
        </>
    );
}

export default SideNav;