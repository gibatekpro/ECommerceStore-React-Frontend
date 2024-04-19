import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the context
const MediaQueryContext = createContext();

// Custom hook to use the media query context
export const useMediaQuery = () => useContext(MediaQueryContext);

// Provider component that encapsulates the logic for media query state
export const MediaQueryProvider = ({ children }) => {
    const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 720px)").matches);
    const [isMedium, setIsMedium] = useState(window.matchMedia("(max-width: 1080px) and (min-width: 721px)").matches);
    const [isLarge, setIsLarge] = useState(window.matchMedia("(min-width: 1401px)").matches);

    useEffect(() => {
        const mediaQueryMobile = window.matchMedia("(max-width: 720px)");
        const mediaQueryMedium = window.matchMedia("(max-width: 1080px) and (min-width: 721px)");
        const mediaQueryLarge = window.matchMedia("(min-width: 1401px)");

        const handleResize = () => {
            setIsMobile(mediaQueryMobile.matches);
            setIsMedium(mediaQueryMedium.matches);
            setIsLarge(mediaQueryLarge.matches);
        };

        mediaQueryMobile.addEventListener("change", handleResize);
        mediaQueryMedium.addEventListener("change", handleResize);
        mediaQueryLarge.addEventListener("change", handleResize);

        // Cleanup function to remove the event listeners
        return () => {
            mediaQueryMobile.removeEventListener("change", handleResize);
            mediaQueryMedium.removeEventListener("change", handleResize);
            mediaQueryLarge.removeEventListener("change", handleResize);
        };
    }, []);

    return (
        <MediaQueryContext.Provider value={{ isMobile, isMedium, isLarge }}>
            {children}
        </MediaQueryContext.Provider>
    );
};
