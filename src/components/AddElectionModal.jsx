/* eslint-disable react/prop-types */
import Modal from 'react-modal';
import CreateElection from './ElectionForm';
import { FaTimes } from 'react-icons/fa';

Modal.setAppElement('#root');

const AddElectionModal = ({ Data, isOpen, onRequestClose, onCreate, loading, error }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Election Modal"
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
            overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75"
        >
            <div className="bg-white p-8 md:p-8 rounded-lg relative w-full max-w-sm md:max-w-lg lg:max-w-2xl h-full max-h-[60vh] overflow-auto">
                <button
                    onClick={onRequestClose}
                    className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                >
                    <FaTimes />
                </button>
                <CreateElection Data={Data} onCreate={onCreate} loading={loading} error={error} />
            </div>
        </Modal>
    );
};

export default AddElectionModal;
