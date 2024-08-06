/* eslint-disable react/prop-types */
import  { createContext, useState } from 'react';

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
    const [isEAModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({});

    const openModal = (props) => {
        console.log('openModal');
        setModalProps(props);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        console.log('closeModal');
        setIsModalOpen(false);
        setModalProps({});
    };

    return (
        <ModalContext.Provider value={{ isEAModalOpen, modalProps, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export { ModalContext, ModalProvider };
