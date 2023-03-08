import * as React from 'react';
import { size, Screen } from '../data/contants';

function useDeviceDetect() {
    const getDeviceConfig = (width) => {
        if (width < Number(size.desktop)) {
            return Screen.MOBILE;
        } else {
            return Screen.DESKTOP;
        }
    }

    const [screen, setScreen] = React.useState(Screen.DESKTOP);

    const handleWindowSizeChange = React.useCallback(() => {
        const width = window.innerWidth;
        setScreen(getDeviceConfig(width));
    }, []);

    React.useEffect(() => {
        handleWindowSizeChange();
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [handleWindowSizeChange]);
    return {
        screen,
        isMobile: screen === Screen.MOBILE,
        isDesktop: screen === Screen.DESKTOP,
    };
}

export default useDeviceDetect;