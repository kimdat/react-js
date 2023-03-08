import React from 'react';
import styles from './Accordion.module.scss';

const Accordion = (props) => {
    const { header, body } = props;
    const [open, setOpen] = React.useState(false);
    const clickHandle = (e) => {
        setOpen(!open);
    }
    return (
        <div className={styles.accordion} data-open={open}>
            <div className={styles.accordionHeader} onClick={clickHandle}>
                <span className={styles.iconSubMenu} ></span>
                {header}
            </div>
            <div className={styles.accordionBody}>
                {body}
            </div>
        </div>
    );
}

export default Accordion;