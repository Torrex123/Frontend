import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    show: boolean;
    setShow: (show: boolean) => void;
    message: string;
    type?: 'error' | 'success' | 'info' | 'warning';
    duration?: number;
}

const Toast = ({
    show,
    setShow,
    message,
    type = 'info',
    duration = 5000
}: ToastProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const alertClasses = {
        error: 'alert-error',
        success: 'alert-success',
        info: 'alert-info',
        warning: 'alert-warning'
    };

    // Icons based on toast type
    const icons = {
        error: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        info: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    };

    useEffect(() => {
        setIsVisible(show);
    }, [show]);

    // Auto-dismiss after duration
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setShow(false);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, setShow]);

    // Handle manual dismiss
    const handleDismiss = () => {
        setIsVisible(false);
        setShow(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    className="fixed top-4 right-4 z-50 max-w-sm shadow-lg"
                >
                    <div className={`alert ${alertClasses[type] || 'alert-info'} shadow-lg`}>
                        <div className="flex items-center">
                            <span>{icons[type]}</span>
                            <div className="ml-2">{message}</div>
                        </div>
                        <button onClick={handleDismiss} className="btn btn-sm btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;