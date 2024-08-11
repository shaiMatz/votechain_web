/* eslint-disable react/prop-types */
import useGsapAnimation from '../hooks/useGsapAnimation';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';
import { breakpoints } from '../config';
import { IoClose } from 'react-icons/io5';

const Modal = ({ title, content, onClose, onConfirm, buttonclass, confirmDisabled }) => {
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
            <div ref={ref} className={`bg-white rounded-lg p-6 md:p-8 shadow-lg ${getModalSizeClass()} mx-auto relative`}>
               
                <div className='flex justify-between items-start mb-4'>
                    <h2 className="text-lg lg:text-3xl font-semibold  text-primary">{title}</h2>
<button
                    type="button"
                    onClick={onClose}
                    className=" text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out"
                >
                    <IoClose className="h-6 w-6" />
                </button>
                </div>  <div className="text-lg text-gray-600 mb-6">{content}</div>
                <div className={`flex justify-end space-x-4 ${buttonclass}`}>
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onConfirm} disabled={confirmDisabled}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
