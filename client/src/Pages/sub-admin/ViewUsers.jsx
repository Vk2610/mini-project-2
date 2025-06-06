import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaSearch, FaSort } from 'react-icons/fa'; // Add this import

const PAGE_SIZE = 10;  // This ensures 10 users per page

const ViewUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Get sub-admin's details including branch
        const subAdminResponse = await axios.get(
          `http://localhost:3000/sub-admin/${jwtDecode(token).id}`, // Use profile endpoint instead
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Sub-admin response:", subAdminResponse.data);

        const branch = subAdminResponse.data.data.Branch_Name;
        
        if (!branch) {
          throw new Error('Branch information not found');
        }

        // Fetch users for this branch
        const usersResponse = await axios.get(
          `http://localhost:3000/sub-admin/branch/${branch}?page=${page}&limit=${PAGE_SIZE}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const responseData = usersResponse.data;
        setUsers(Array.isArray(responseData) ? responseData : responseData.users || []);
        setTotalUsers(responseData.total || responseData.length || 0);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch users');
        setLoading(false);
        
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUsers();
  }, [page, navigate]);

  // Calculate start and end indices for current page
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  useEffect(() => {
    // Filter and sort users whenever users array or search term changes
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.Employee_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.HRMS_No?.toString().includes(searchTerm)
      );
    }
    
    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let aValue = a[sortField] || '';
        let bValue = b[sortField] || '';
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    setFilteredUsers(result);
    setTotalUsers(result.length);
  }, [users, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">View Users</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or HRMS no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr. No.
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('HRMS_No')}
                  >
                    <div className="flex items-center">
                      HRMS No.
                      {sortField === 'HRMS_No' && (
                        <FaSort className="ml-2" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('Employee_Name')}
                  >
                    <div className="flex items-center">
                      Employee Name
                      {sortField === 'Employee_Name' && (
                        <FaSort className="ml-2" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.slice(startIndex, endIndex).map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.HRMS_No || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.Employee_Name || user.fullname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/sub-admin/users/${user.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;