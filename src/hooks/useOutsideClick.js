import React from 'react';

const useOutsideClick = (ref, onClickOutside) => {
    React.useEffect(() => {
 
        // Function for click event
        function handleOutsideClick(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutside && onClickOutside();
            }
        }
     
        // Adding click event listener
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, [ref]);
}

export default useOutsideClick;