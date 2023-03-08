import React from 'react';

const HamburgerIcon = (props) => {
    const { title = "Open sidebar menu", color = "#fff" } = props;
    return (
        <svg aria-labelledby="hamburger-icon110" role="img" viewBox="0 0 36 30" xmlns="http://www.w3.org/2000/svg">
            <title id="hamburger-icon110">{title}</title>
            <g fillRule="evenodd" fill={color}>
                <path d="m0 0v6h36v-6z"></path>
                <path d="m0 12v6h36v-6z"></path>
                <path d="m0 24v6h36v-6z"></path>
            </g>
        </svg>
    );
}

export default HamburgerIcon;