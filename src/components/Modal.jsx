/* eslint-disable react/prop-types */
import useGsapAnimation from '../hooks/useGsapAnimation';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';
import { breakpoints } from '../config';
import { IoClose } from 'react-icons/io5';

const Modal = ({ title, content, onClose, onConfirm }) => {
    const ref = useGsapAnimation({
        from: { opacity: 0, y: -50 },
        to: { opacity: 1, y: 0, duration: 0.5 },
    });

    const index = useResponsiveJSX(breakpoints);

    const getModalSizeClass = () => {
        switch (index) {
            case 0: return 'max-w-xs'; // Small screens
            case 1: return 'max-w-md'; // Medium screens
            default: return 'max-w-lg'; // Large screens
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={ref} className={`bg-white rounded-lg p-8 shadow-lg ${getModalSizeClass()} mx-auto relative`}>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out"
                >
                    <IoClose className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-semibold mb-6 text-primary">{title}</h2>
                <p className="text-lg text-gray-600 mb-6">{content}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-400 transition duration-300"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
