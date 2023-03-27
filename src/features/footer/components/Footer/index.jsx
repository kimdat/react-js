import React from 'react';
import styles from './Footer.module.scss';
import classNames from 'classnames';

const cx = classNames.bind(styles);

const Footer = (props) => {
    const { className } = props;
    return (
        <footer className={cx(className, styles.footer)}>

        </footer>
    );
}

export default Footer;