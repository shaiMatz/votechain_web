import { useEffect, useContext, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { EAContext } from '../contexts/EAContext';
import Modal from '../components/Modal';
import AddEAModal from '../components/AddEAModal';
import { CiMenuKebab } from 'react-icons/ci';
import { PiMemory } from 'react-icons/pi';
import { IoTrash, IoAdd, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";
import { clearTables } from '../services/clearTables';
import { loadContract, session } from '../services/sessionService';
import { getRAM, delegate } from '../services/getRAM';
import { useCreateManager, useGetEAList, useDeleteManager, useUpdateManager } from '../api/EAService';
import { ADMINPASSWORD } from '../config';
const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { EAs, setEAs, setLoading, setError, loading } = useContext(EAContext);
  const { createManager } = useCreateManager();
  const { getEAList } = useGetEAList();
  const { deleteManager } = useDeleteManager();
  const { updateManager } = useUpdateManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEaModalOpen, setIsAddEaModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // State to track which dropdown is open
  const [isClearingTables, setIsClearingTables] = useState(false); // State for clear tables button
  const [isGettingRam, setIsGettingRam] = useState(false); // State for get RAM button
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [deleteEAId, setDeleteEAId] = useState(null); // State for EA to be deleted
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editEaData, setEditEaData] = useState(null); // Add this line to define the state
const [isDeligating, setIsDeligating] = useState(false); // State for deligate button
  const fetchEAList = useCallback(async () => {
    const result = await getEAList();
    if (result && result.error_code === 0) {
      console.log('EA list:', result.data);
      setEAs(result.data);
    } else {
      setError(result.message || 'Error fetching EA list');
    }
  }, [getEAList, setEAs, setError]);

  useEffect(() => {
    fetchEAList();
  }, [fetchEAList]);

  useEffect(() => {
    if (loading !== undefined) {
      setLoading(loading);
    }
  }, [loading, setLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click was inside the dropdown menu or its children
      if (dropdownOpen && event.target.closest('.dropdown-menu')) {
        return;
      }
      // Close the dropdown if the click was outside
      setDropdownOpen(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);


  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedEAs = useMemo(() => {
    let sortableEAs = [...EAs];
    sortableEAs.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableEAs;
  }, [EAs, sortConfig]);

  const filteredEAs = useMemo(() => {
    return sortedEAs.filter(ea => {
      return ea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ea.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ea.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [sortedEAs, searchTerm]);

  const handleCreateEA = async ({ fullname, email, password, user_id }) => {
    const userData = {
      fullname: fullname,
      email: email,
      user_id,
      password,
      role: 'ea',
    };
    setFormLoading(true);
    try {
      const ans = await createManager(userData);
      if (ans && ans.error_code === 0) {
        fetchEAList();
        setIsAddEaModalOpen(false);
        setError('');
      } else {
        console.log('Error creating EA', ans);
        setError(ans.message || 'Error creating EA');
      }
    } catch (error) {
      console.log('Error creating EA', error);
    }
    setFormLoading(false);
  };

  const handleClearTables = async () => {
    if (password === ADMINPASSWORD) {
      setIsClearingTables(true);
      const contract = await loadContract();
      const result = await clearTables(session, contract);
      setIsClearingTables(false);
      if (result === 'tables cleared successfully') {
        console.log('Tables cleared');
      }
    } else {
      console.log('Incorrect password');
    }
    setIsModalOpen(false);
  };

  const handleGetRam = async () => {
    setIsGettingRam(true);
    const result = await getRAM(session);
    setIsGettingRam(false);
    if (result === 'RAM bought successfully') {
      console.log('RAM acquired');
    }
  };

  const handledeligate = async () => {
    setIsDeligating(true);
    const result = await delegate(session);
    setIsDeligating(false);
    if (result === 'Delegated successfully') {
      console.log('Delegated successfully');
    }
  };

  const handleRowClick = (eaId) => {
    navigate(`/ea/${eaId}`);
  };

  const handleMenuClick = (eaId, event) => {
    event.stopPropagation();
    setDropdownOpen(dropdownOpen === eaId ? null : eaId); // Toggle dropdown visibility
  };

  const handleEditClick = (eaId, event) => {
    event.stopPropagation();
    console.log(`Edit EA ${eaId}`);
    setEditEaData(EAs.find(ea => ea.id === eaId)); // Set the EA data for editing
    setIsAddEaModalOpen(true); // Use the existing modal state
    setDropdownOpen(null);
  };

  const handleDeleteClick = (eaId, event) => {
    event.stopPropagation();
    setDeleteEAId(eaId);
    setIsDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const handleConfirmDelete = async () => {
    console.log(`Delete EA ${deleteEAId}`);
    await deleteManager(deleteEAId);
    fetchEAList();
    setIsDeleteModalOpen(false);
  };

  const handleViewClick = (eaId, event) => {
    event.stopPropagation();
    navigate(`/ea/${eaId}`);
    setDropdownOpen(null);
  };

  const handleUpdate = async ({ fullname, email, password, user_id, id ,date}) => {
    const updatedData = {
      id,
      date,
      name: fullname,
      email: email,
      user_id,
      password,
      role: 'ea',
    };
    setFormLoading(true);
    try {
      const ans = await updateManager(updatedData);
      if (ans && ans.error_code === 0) {
        fetchEAList();
        setIsAddEaModalOpen(false);
        setError('');
      } else {
        console.log('Error updating EA', ans);
        setError(ans.message || 'Error updating EA');
      }
    } catch (error) {
      console.log('Error updating EA', error);
    }
    setFormLoading(false);
  };

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  const totalPages = Math.ceil(filteredEAs.length / itemsPerPage);
  const paginatedEAs = filteredEAs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="md:p-6 min-h-screen bg-white text-gray-800">
      <Navbar />
      <div className="mt-4 p-6 flex flex-wrap gap-4">
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
          onClick={handleGetRam}
          className="flex items-center py-2 px-4 border rounded-lg border-secondary-100 shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {isGettingRam ? <div className="loader">Getting RAM...</div> : (
            <>
              <PiMemory className="h-5 w-5 mr-2" />
              Get RAM
            </>
          )}
        </button>
        <button
          onClick={handledeligate}
          className="flex items-center py-2 px-4 border rounded-lg border-secondary-100 shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {isDeligating ? <div className="loader">Deligating...</div> : (
            <>
              <PiMemory className="h-5 w-5 mr-2" />
              Deligate
              </>
              )}
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center py-2 px-4 border rounded-lg border-secondary-100 shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {isClearingTables
            ? <div className="loader">Clearing...</div>
            : (
              <>
                <IoTrash className="h-5 w-5 mr-2" />
                Clear Tables
              </>
            )}
        </button>
      </div>

      <div className="p-6 h-full">
        <h2 className="text-2xl font-bold mb-4">Manage EAs</h2>

        <div className="flex justify-between items-center mb-4 flex-wrap space-y-2 ">
          <input
            type="text"
            placeholder="Search by EA name, email, user ID"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-gray-300 transition duration-200 bg-transparent outline-none text-gray-800"
          />
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded px-3  py-2 shadow-sm focus:ring-2 focus:ring-gray-300 transition duration-200 bg-transparent outline-none text-gray-800"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="w-full">
          {/* Display the table only on medium and larger screens */}
          <div className="hidden md:block ">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-nowrap border-b text-start"></th>
                  <th className="py-2 px-4 text-nowrap border-b text-start cursor-pointer" onClick={() => requestSort('name')}>
                    EA Name {getSortArrow('name') && <span>{getSortArrow('name')}</span>}
                  </th>
                  <th className="py-2 px-4 text-nowrap border-b text-start cursor-pointer" onClick={() => requestSort('id')}>
                    ID {getSortArrow('id') && <span>{getSortArrow('id')}</span>}
                  </th>
                  <th className="py-2 px-4 text-nowrap border-b text-start cursor-pointer" onClick={() => requestSort('email')}>
                    Email {getSortArrow('email') && <span>{getSortArrow('email')}</span>}
                  </th>
                  <th className="py-2 px-4 text-nowrap border-b text-start cursor-pointer" onClick={() => requestSort('date')}>
                    Date {getSortArrow('date') && <span>{getSortArrow('date')}</span>}
                  </th>
                  <th className="py-2 px-4 text-nowrap border-b text-start cursor-pointer" onClick={() => requestSort('user_id')}>
                    User ID {getSortArrow('user_id') && <span>{getSortArrow('user_id')}</span>}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEAs.map(ea => (
                  <tr key={ea.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="py-2 px-4 border-b text-center relative">
                      <div className="relative inline-block dropdown-menu">
                        <CiMenuKebab className="h-5 w-5 text-gray-500 cursor-pointer" onClick={(event) => handleMenuClick(ea.id, event)} />
                        {dropdownOpen === ea.id && (
                          <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10" onClick={(event) => event.stopPropagation()}>
                            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={(event) => handleEditClick(ea.id, event)}>Edit</button>
                            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={(event) => handleDeleteClick(ea.id, event)}>Delete</button>
                            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={(event) => handleViewClick(ea.user_id, event)}>View</button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-nowrap border-b cursor-pointer" onClick={() => handleRowClick(ea.user_id)}>{ea.name}</td>
                    <td className="py-2 px-4 text-nowrap border-b cursor-pointer" onClick={() => handleRowClick(ea.user_id)}>{ea.id}</td>
                    <td className="py-2 px-4 text-nowrap border-b cursor-pointer" onClick={() => handleRowClick(ea.user_id)}>{ea.email}</td>
                    <td className="py-2 px-4 text-nowrap border-b cursor-pointer" onClick={() => handleRowClick(ea.user_id)}>{ea.date}</td>
                    <td className="py-2 px-4 text-nowrap border-b cursor-pointer" onClick={() => handleRowClick(ea.user_id)}>{ea.user_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Display the card layout only on small screens */}
          <div className="block md:hidden">
            {paginatedEAs.map(ea => (
              <div key={ea.id} className="bg-white shadow-md rounded-lg mb-4 p-4 cursor-pointer" onClick={() => handleRowClick(ea.user_id)}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{ea.name}</h3>
                  <div className="relative inline-block dropdown-menu">
                  <CiMenuKebab className="h-5 w-5 text-gray-500 cursor-pointer" onClick={(event) => handleMenuClick(ea.id, event)} />
                  {dropdownOpen === ea.id && (
                    <div className="absolute right-4 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                      <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={(event) => handleEditClick(ea.id, event)}>Edit</button>
                      <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={(event) => handleDeleteClick(ea.id, event)}>Delete</button>
                      <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={(event) => handleViewClick(ea.user_id, event)}>View</button>
                    </div>
                  )}
                  </div>
                </div>
                <p><strong>ID:</strong> {ea.id}</p>
                <p><strong>Email:</strong> {ea.email}</p>
                <p><strong>Date:</strong> {ea.date}</p>
                <p><strong>User ID:</strong> {ea.user_id}</p>
              </div>
            ))}
          </div>
        </div>

        {!formLoading && filteredEAs.length === 0 && (
          <p className="text-lg text-center p-3 text-red-500">No EA&apos;s available.</p>
        )}
      </div>

      <div className="flex justify-center items-center mt-4">
        <RxDoubleArrowLeft
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`h-6 w-6 mx-1 cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <IoChevronBack
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`h-6 w-6 mx-1 cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <span className="py-2 px-4 mx-1">Page {currentPage} of {totalPages}</span>
        <IoChevronForward
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`h-6 w-6 mx-1 cursor-pointer ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <RxDoubleArrowRight
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`h-6 w-6 mx-1 cursor-pointer ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
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
          onClose={() => {setIsAddEaModalOpen(false); setEditEaData(null); setError('');}}
          onSubmit={editEaData ? handleUpdate : handleCreateEA}
          editData={editEaData} // Correctly pass editEaData instead of editData
        />
      )}

      {isDeleteModalOpen && (
        <Modal
          title="Confirm Delete"
          content={<p>Are you sure you want to delete this EA?</p>}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

    </div>
  );
};

export default ManagerDashboard;
