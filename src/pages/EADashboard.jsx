import { useContext, useState } from 'react';
import { EAElectionContext } from '../contexts/EAElectionContext';
import Navbar from '../components/Navbar';
import ElectionActions from '../components/ElectionActions';
import { useGetElection } from '../api/electionService';
import ElectionItem from '../components/ElectionItem';

const EADashboard = () => {
  const { elections } = useContext(EAElectionContext);
  const { loading, error } = useGetElection();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

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
      {loading && <p className="text-lg text-gray-700">Loading...</p>}
      {error && <p className="text-lg text-red-500">Error loading elections: {error.message}</p>}
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
      </div>
    </div>
  );
};

export default EADashboard;
