/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useContext } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import useGsapAnimation from '../hooks/useGsapAnimation';
import AddElectionModal from './AddElectionModal';
import { ModalContext } from '../contexts/ModalContext';
import { ElectionContext } from '../contexts/ElectionContext';

const ElectionItem = ({ election, isManager }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const menuRef = useRef(null);
    const { openModal, closeModal } = useContext(ModalContext);
    const { handleDeleteElection, updateElectionData,loading,error } = useContext(ElectionContext); // Use handleDeleteElection and updateElectionData from context

    const handleDelete = () => {
        openModal({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this election? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const success = await handleDeleteElection(election.id);
                    if (success) {
                        console.log('Deletion successful');
                        setMenuOpen(false);
                    } else {
                        console.error('Deletion failed');
                    }
                } catch (error) {
                    console.error('Failed to delete election:', error);
                } finally {
                    closeModal();
                }
            },
            onClose: () => {
                setMenuOpen(false);
            },
        });
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    const handleEditToggle = () => {
        setEditing(true);
        setMenuOpen(false);
    };


    const handleUpdate = async (updatedData, payload) => {
        try {
            setEditing(false);
            console.log('Updated Data before:', updatedData);
            updatedData.id = election.id;

            console.log('Updated Data after:', updatedData);
            var backPayload = {
                id: updatedData.id,
                name: updatedData.name,
                startdate: updatedData.startdate,
                enddate: updatedData.enddate,
                candidates: updatedData.candidates.map(candidate => ({
                    name: candidate.name? candidate.name : null,
                    party: candidate.party? candidate.party : null
                })),
                isended: updatedData.isended,
                minage: updatedData.voterscriteria.minage,
                maxage: updatedData.voterscriteria.maxage,
                city: updatedData.voterscriteria.city,
                state: updatedData.voterscriteria.state,
                userList: updatedData.voterscriteria.userList
            };
            const success = await updateElectionData(backPayload, payload, isManager, updatedData);
            if (success) {
                console.log('Election updated successfully');
            } else {
                console.error('Failed to update election');
            }
        } catch (error) {
            console.error('Error in handleUpdate:', error);
        }
    };


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const animationRef = useGsapAnimation({
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0, duration: 1 },
    });

    const now = new Date();
    const startDate = new Date(election.startdate);
    const endDate = new Date(election.enddate);
    const isStarted = now >= startDate && now <= endDate;
    const isEnded = now > endDate;
    const isStartingSoon = now < startDate && startDate - now <= 7 * 24 * 60 * 60 * 1000; // Starting within a week
    const isEditable = (!isStarted && !isEnded) || isManager;

    let statusLabel = '';
    if (isEnded) {
        statusLabel = 'Ended';
    } else if (isStarted) {
        statusLabel = 'Started';
    } else if (isStartingSoon) {
        statusLabel = 'Starting Soon';
    } else {
        statusLabel = 'Upcoming';
    }

    return (
        <div ref={animationRef} className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
            <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center w-full">
                    <h3 className="text-gray-900 text-lg md:text-xl font-bold">{election.name}</h3>
                    <span
                        className={`text-sm px-2 py-1 rounded-lg text-white ${statusLabel === 'Ended'
                            ? 'bg-red-400'
                            : statusLabel === 'Started'
                                ? 'bg-green-500'
                                : statusLabel === 'Starting Soon'
                                    ? 'bg-yellow-200'
                                    : 'bg-blue-300'
                            }`}
                    >
                        {statusLabel}
                    </span>
                </div>
                <div className="flex justify-end space-x-2" ref={menuRef}>
                    {isEditable && (
                        <>
                            <button className="text-gray-500 hover:text-gray-700" onClick={toggleMenu}>
                                <FaEllipsisV />
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-40 md:w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={handleEditToggle}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <p className="text-gray-700 mb-2">{election.startdate} to {election.enddate}</p>
            <p className="text-gray-700 mb-4">Candidates: {election.candidates && Array.isArray(election.candidates) ? election.candidates.map(c => c.name).join(', ') : 'No candidates'}</p>
            {editing && (
                <AddElectionModal
                    Data={election}
                    isOpen={editing}
                    onRequestClose={() => setEditing(false)}
                    onCreate={handleUpdate}
                    loading={loading} // Replace with actual loading state if necessary
                    error={error} // Replace with actual error state if necessary
                />
            )}
        </div>
    );
};

export default ElectionItem;
