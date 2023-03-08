import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import styles from './NavProfile.module.scss';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDeviceDetect from '../../../../hooks/useDeviceDetect';

const NavProfile = (props) => {
    const { profileGreeting, signOut, icon, manageProfile } = props;
    const { isMobile } = useDeviceDetect();
    const email = "nguyenbaduc355@gmail.com";
    const username = "Nguyễn Bá Đức";

    const profileToggleButton = (
        <button className={styles.profileToggleButton}>
            {!isMobile &&
                <>
                    <span className={styles.profileIcon}>{icon}</span>
                    <span>{username}</span>
                </>
            }
            {isMobile && icon}
        </button>
    );

    const closeBtn = (
        <button className={styles.closeButton} aria-label="Close">
            <FontAwesomeIcon icon={faClose} />
        </button>
    );

    const profileContent = (
        <div className={styles.profileBody}>
            <div className={styles.profileNameBar}>
                <div className={styles.title}>
                    <h4 className={styles.titleText}>{profileGreeting(username)}</h4>
                </div>
                <div className={styles.title}>
                    <h4 className={styles.titleText}>{email}</h4>
                </div>
                <button className={styles.button} type="button" title={signOut}>
                    <a href="/">{signOut}</a>
                </button>
            </div>
            <div className={styles.profileActions}>
                <a href="/">{manageProfile}</a>
            </div>
        </div>
    );

    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                {profileToggleButton}
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    sideOffset={0}
                    align='end'
                    className={styles.profilePopoverWrapper}>
                    <Popover.Arrow className={styles.profileArrow} />
                    <Popover.PopoverClose asChild>
                        {closeBtn}
                    </Popover.PopoverClose>
                    {profileContent}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

export default NavProfile;