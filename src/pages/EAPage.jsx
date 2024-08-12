import { useEffect, useContext, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useGetManager } from '../api/EAService';
import Navbar from '../components/Navbar';
import ElectionActions from '../components/ElectionActions';
import ElectionItem from '../components/ElectionItem';
import Modal from '../components/Modal';
import { ElectionContext } from '../contexts/ElectionContext';
import { ModalContext } from '../contexts/ModalContext';

const EAPage = () => {
    const { eaId } = useParams();
    const { getManager, data: managerData, loading: loadingManager, error: errorManager } = useGetManager();
    const { detailedElections: elections, fetchElectionsByEA, fetchDetailedElections, deleteElection, electionToDelete, setElectionToDelete, loading, error } = useContext(ElectionContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const { isEAModalOpen, modalProps, closeModal } = useContext(ModalContext);
    useEffect(() => {
        const fetchEData = async () => {
            if (eaId) {
                try {
                    console.log('Fetching manager with ID:', eaId);
                    const managerResponse = await getManager(eaId.toString());
                    if (managerResponse && managerResponse.error_code === 1) return;

                    const electionsResponse = await fetchElectionsByEA(managerResponse.data.id);
                    console.log("res2", electionsResponse);
                    if (electionsResponse && electionsResponse.error_code === 1) return;

                    if (electionsResponse && electionsResponse.data && Array.isArray(electionsResponse.data) && electionsResponse.data.length > 0) {
                        console.log('Elections Response:', electionsResponse.data);
                        var res = await fetchDetailedElections(electionsResponse.data);
                        console.log("res3", res);
                    } else {
                        console.error('No valid data found in electionsResponse:', electionsResponse);
                        // Handle cases where electionsResponse.data is not an array or is empty
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }else{
                Navigate('/404');
            }
        };
        fetchEData();
    }, [eaId, getManager, fetchElectionsByEA, fetchDetailedElections]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleDeleteElection = (electionId) => {
        setElectionToDelete(electionId);
    };

    const confirmDeleteElection = async () => {
        if (electionToDelete) {
            console.log("Deleting Election:" + electionToDelete);
            var res= await deleteElection(electionToDelete)
            if(res.error_code === 0){
            setElectionToDelete(null);
            console.log("Election Deleted," + electionToDelete);
            }
            else{
                console.log("Election Not Deleted," + electionToDelete);
            }

        }
    };

    const cancelDeleteElection = () => {
        setElectionToDelete(null);
    };


    const filteredElections = (elections || []).filter((election) => {
        const matchesSearch = election.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'active' && !election.isended) ||
            (filter === 'ended' && election.isended);
        return matchesSearch && matchesFilter;
    });



    return (
        <div  className="p-4 md:p-10 min-h-screen">
            <Navbar />
            <div className="mt-6 px-6">
                <h2 className="text-2xl font-bold text-primary mb-4">Election Administrator Details</h2>
                {loadingManager && <p className="text-lg text-gray-700">Loading...</p>}
                {errorManager && <p className="text-lg text-red-500">Error: {errorManager.message}</p>}
                {managerData && (
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6 md:w-1/2 lg:w-1/3 ">
                        <p className="text-lg text-gray-700 break-words"><b>Name:</b> {managerData.name}</p>
                        <p className="text-lg text-gray-700  break-words"><b>Email:</b> {managerData.email}</p>
                        <p className="text-lg text-gray-700"><b>ID:</b> {managerData.user_id}</p>
                    </div>
                )}
            </div>
            <ElectionActions
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filter={filter}
                onFilterChange={handleFilterChange}
                ea_id={managerData?.id? managerData.id : null}
            />
            <div className="mt-6 px-6">
                <h2 className="text-2xl font-bold text-primary mb-4">Elections</h2>
                {loading && <p className="text-lg text-gray-700">
                    <span className="flex justify-center items-center h-32">
                        <span className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></span>
                    </span>
                </p>}
                {error && <p className="text-lg text-red-500">Error: {error.message}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && !error && elections && filteredElections.length > 0 ? (
                        filteredElections.map((election) => (
                            <ElectionItem key={election.id} election={election} onDelete={handleDeleteElection} isManager={true}/>
                        ))
                    ) : (
                        <p className="text-lg text-gray-700">No elections available.</p>
                    )}
                </div>
            </div>
            {electionToDelete && (
                <Modal
                    title="Confirm Deletion"
                    content="Are you sure you want to delete this election? This action cannot be undone."
                    onClose={cancelDeleteElection}
                    onConfirm={confirmDeleteElection}

                />
            )}
            {isEAModalOpen && (
                <Modal
                    title={modalProps.title}
                    content={modalProps.content}
                    onClose={closeModal}
                    onConfirm={modalProps.onConfirm}
                />
            )}
        </div>
    );
};

export default EAPage;
