import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { EAElectionContext } from '../contexts/EAElectionContext';
import { useCreateUser } from '../api/voterService';
import { useGetElectionsByUser } from '../api/electionService';
import Modal from '../components/Modal';
import AddEAModal from '../components/AddEAModal';
import { CiMenuKebab } from 'react-icons/ci';
import { PiMemory } from 'react-icons/pi';
import { IoTrash, IoAdd } from 'react-icons/io5';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { elections, setElections } = useContext(EAElectionContext);
  const { createUser } = useCreateUser();
  const { getElectionsByUser } = useGetElectionsByUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEaModalOpen, setIsAddEaModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // State to track which dropdown is open

  useEffect(() => {
    getElectionsByUser({ user_id: 123 })
      .then(response => {
        setElections(response.data || []);
      })
      .catch(console.error);
  }, [getElectionsByUser, setElections]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = event => {
    setFilter(event.target.value);
  };

  const handleCreateEA = ({ fullname, phonenumber, password, user_id }) => {
    const userData = {
      fullname: fullname,
      phonenumber: phonenumber,
        password, 
        user_id, 
        role: 'ea',
      birthdate: '1990-01-01',
      privatekey: 'privatekeyvalue',
      publickey: "publickeyvalue",
      username: "fullname"
       };
    setFormLoading(true);
    var ans = createUser(userData)
    if (ans&& ans.error_code === 0) {
      setElections([...elections, ans]);
    }  else {
      console.log('Error creating EA');
    }
    setIsAddEaModalOpen(false);
  };

  const handleClearTables = () => {
    if (password === 'your_password') {
      console.log('Tables cleared');
    } else {
      console.log('Incorrect password');
    }
    setIsModalOpen(false);
  };

  const handleGetRam = () => {
    console.log('RAM acquired');
  };

  const filteredElections = elections.filter(election => {
    const matchesSearch = election.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'active' && !election.isended) || (filter === 'ended' && election.isended);
    return matchesSearch && matchesFilter;
  });

  const handleRowClick = (eaId) => {
    navigate(`/ea/${eaId}`);
  };

  const handleMenuClick = (eaId, event) => {
    event.stopPropagation();
    setDropdownOpen(dropdownOpen === eaId ? null : eaId); // Toggle dropdown visibility
  };

  const handleEditClick = (eaId) => {
    console.log(`Edit EA ${eaId}`);
    setDropdownOpen(null);
  };

  const handleDeleteClick = (eaId) => {
    console.log(`Delete EA ${eaId}`);
    setDropdownOpen(null);
  };

  const handleViewClick = (eaId) => {
    navigate(`/ea/${eaId}`);
    setDropdownOpen(null);
  };

  return (
    <div className="md:p-10 min-h-screen bg-white text-gray-800">
      <Navbar />
      <div className="mt-4 p-6 flex space-x-4">
        <button
          onClick={() => setIsAddEaModalOpen(true)}
          className="flex items-center py-2 px-4 border rounded-lg border-secondary-100 shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <>
            <IoAdd className="h-5 w-5 mr-2" />
            Add EA
          </>
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center py-2 px-4 border rounded-lg border-secondary-100 shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <IoTrash className="h-5 w-5 mr-2" />
          Clear Tables
        </button>
        <button
          onClick={handleGetRam}
          className="flex items-center py-2 px-4 border rounded-lg border-secondary-100 shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <PiMemory className="h-5 w-5 mr-2" />
          Get RAM
        </button>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage EAs</h2>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by EA name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-gray-300 transition duration-200 bg-transparent outline-none text-gray-800"
          />
          <select
            value={filter}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-gray-300 transition duration-200 bg-transparent outline-none text-gray-800"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
          </select>
        </div>
   
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-start"></th>
                <th className="py-2 px-4 border-b text-start">EA Name</th>
                <th className="py-2 px-4 border-b text-start">ID</th>
                <th className="py-2 px-4 border-b text-start">Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredElections.map(ea => (
                <tr key={ea.id} className="hover:bg-gray-100 transition duration-200" onClick={() => handleRowClick(ea.id)}>
                  <td className="py-2 px-4 border-b text-center relative">
                    <CiMenuKebab className="h-5 w-5 text-gray-500 cursor-pointer" onClick={(event) => handleMenuClick(ea.id, event)} />
                    {dropdownOpen === ea.id && (
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                        <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => handleEditClick(ea.id)}>Edit</button>
                        <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => handleDeleteClick(ea.id)}>Delete</button>
                        <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => handleViewClick(ea.id)}>View</button>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b cursor-pointer">{ea.name}</td>
                  <td className="py-2 px-4 border-b cursor-pointer">{ea.id}</td>
                  <td className="py-2 px-4 border-b cursor-pointer">{ea.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!formLoading && filteredElections.length === 0 && (
          <p className="text-lg text-center p-3 text-red-500">No EA&apos;s available.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal
          title="Enter Password"
          content={
            <>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border border-gray-300 bg-transparent rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-gray-300 transition duration-200 mb-4 w-full text-gray-800"
              />
            </>
          }
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleClearTables}
        />
      )}

      {isAddEaModalOpen && (
        <AddEAModal
          isOpen={isAddEaModalOpen}
          onClose={() => setIsAddEaModalOpen(false)}
          onSubmit={handleCreateEA}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
