/* eslint-disable react/prop-types */
import Modal from 'react-modal';
import CreateElection from './ElectionForm';
import { FaTimes } from 'react-icons/fa';
import { useEffect } from 'react';

Modal.setAppElement('#root');

const AddElectionModal = ({ Data, isOpen, onRequestClose, onCreate, loading, error, id }) => {
    useEffect(() => {
        const mainContent = document.querySelector('#main-content');
        if (mainContent) {
            if (isOpen) {
                mainContent.style.pointerEvents = 'none';
                mainContent.style.opacity = '0.5';
            } else {
                mainContent.style.pointerEvents = 'auto';
                mainContent.style.opacity = '1';
            }
        }
    }, [isOpen]);



    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Election Modal"
            className="fixed inset-0 flex items-center justify-center h-[100dvh]  bg-gray-800 bg-opacity-75"
            overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 h-[100dvh] "
        >
            <div className="bg-white p-8 md:p-8 rounded-lg relative w-full max-w-xs md:max-w-lg lg:max-w-2xl h-full max-h-[70vh] overflow-auto">
                <button
                    onClick={onRequestClose}
                    className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                    aria-label="Close modal"
                >
                    <FaTimes />
                </button>
                <CreateElection Data={Data} onCreate={onCreate} loading={loading} error={error} id={id} />
            </div>
        </Modal>
    );

};

export default AddElectionModal;
