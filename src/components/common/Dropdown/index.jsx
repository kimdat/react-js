import React from 'react';
import styles from './Dropdown.module.scss';
import useOutsideClick from '../../../hooks/useOutsideClick';

const Dropdown = (props) => {
    const { toggle, content } = props;
    const [open, setOpen] = React.useState(false);
    const handleClick = (e) => {
        setOpen(!open);
    }
    const dropdownRef = React.useRef(null);
    useOutsideClick(dropdownRef, () => {
        setOpen(false);
    });
    return (
        <div className={styles.dropdownWrapper} data-open={open} ref={dropdownRef}>
            <div className={styles.dropdownToggle} onClick={handleClick}>
                {toggle}
            </div>
            <div className={styles.dropdownSubMenu} >
                {content}
            </div>
        </div>
    );
}

export default Dropdown;