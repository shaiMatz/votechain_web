import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ElectionActions from '../components/ElectionActions';
import ElectionItem from '../components/ElectionItem';
import { ElectionContext } from '../contexts/ElectionContext';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import { ModalContext } from '../contexts/ModalContext';
import Modal from '../components/Modal';

const EADashboard = () => {
  const { elections, fetchElectionsByEA, fetchDetailedElections, loading, error } = useContext(ElectionContext); // Default to empty array
  const { user } = useContext(AuthContext); // Access AuthContext
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { isEAModalOpen, modalProps, closeModal } = useContext(ModalContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        console.log('Fetching elections for EA:', user.id);
        await fetchElectionsByEA(user.id)
        if (elections.length > 0) {
          await fetchDetailedElections(elections);
        }
        console.log('elections', elections);
      }
    };

    fetchData();
  }, [user, fetchElectionsByEA, fetchDetailedElections, elections]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredElections = elections.filter((election) => {
    const matchesSearch = election.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && !election.isended) ||
      (filter === 'ended' && election.isended);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-10 min-h-screen">
      <Navbar />
      <ElectionActions
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filter={filter}
        onFilterChange={handleFilterChange}
      />
      <div className="mt-6 px-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Elections</h2>
        {!loading && filteredElections.length === 0 && elections.length === 0 && (
          <p className="text-lg text-gray-700">No elections available at the moment. Please check back later or create a new election.</p>
        )}
        {!loading && filteredElections.length === 0 && elections.length > 0 && (
          <p className="text-lg text-gray-700">No elections match your search criteria.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElections.map((election) => (
            <ElectionItem key={election.id} election={election} />
          ))}
        </div>
        {loading && <p className="text-lg text-gray-700">Loading...</p>}
        {error && <p className="text-lg text-red-500">Error loading elections: {error.message}</p>}
      </div>
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

export default EADashboard;
