import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { useRouter } from 'next/router';
import { Chart } from 'react-google-charts';

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    const { data: candidates, error: candidatesError } = await supabase.from('candidates').select('*');
    const { data: users, error: usersError } = await supabase.from('users').select('*');

    if (candidatesError || usersError) {
      console.error('Error fetching data:', candidatesError || usersError);
      setErrorMessage('Error fetching data from the server.');
      return;
    }

    setCandidates(candidates || []);
    setUsers(users || []);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAddOrEditCandidate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!candidateName.trim()) {
      setErrorMessage('Candidate name cannot be empty.');
      return;
    }

    try {
      if (editingCandidate) {
        const { data, error } = await supabase
          .from('candidates')
          .update({ name: candidateName })
          .eq('id', editingCandidate.id)
          .select();

        if (error) {
          console.error('Error updating candidate:', error);
          setErrorMessage(`An error occurred while updating the candidate: ${error.message}`);
          return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
          setCandidates(candidates.map(candidate => (candidate.id === editingCandidate.id ? data[0] : candidate)));
          setCandidateName('');
          setEditingCandidate(null);
          setSuccessMessage('Candidate updated successfully!');
        } else {
          console.error('Invalid data:', data);
          setErrorMessage('Invalid data received from the server.');
        }
      } else {
        const isDuplicate = candidates.some(candidate => candidate.name.toLowerCase() === candidateName.toLowerCase());
        if (isDuplicate) {
          setErrorMessage('Candidate name already exists.');
          return;
        }

        const { data, error } = await supabase
          .from('candidates')
          .insert([{ name: candidateName }])
          .select();

        if (error) {
          console.error('Error adding candidate:', error);
          setErrorMessage(`An error occurred while adding the candidate: ${error.message}`);
          return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
          setCandidates([...candidates, data[0]]);
          setCandidateName('');
          setSuccessMessage('Candidate added successfully!');
        } else {
          console.error('Invalid data:', data);
          setErrorMessage('Invalid data received from the server.');
        }
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err);
      setErrorMessage(`An unexpected error occurred: ${err.message}`);
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting candidate:', error);
        setErrorMessage(`An error occurred while deleting the candidate: ${error.message}`);
        return;
      }

      setCandidates(candidates.filter(candidate => candidate.id !== id));
      setSuccessMessage('Candidate deleted successfully!');
    } catch (err) {
      console.error('An unexpected error occurred:', err);
      setErrorMessage(`An unexpected error occurred: ${err.message}`);
    }
  };

  const handleEditCandidate = (candidate) => {
    setCandidateName(candidate.name);
    setEditingCandidate(candidate);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/');
  };

  const totalVotes = candidates.reduce((acc, candidate) => acc + (candidate.vote_count || 0), 0);
  const totalUsers = users.length;

  const voteData = candidates.map(candidate => [
    candidate.name,
    candidate.vote_count || 0,
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 px-4">
      <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
          <span className={`text-sm font-medium ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md">
            <h3 className="text-white text-xl font-semibold">Total Candidates</h3>
            <p className="text-white text-3xl">{candidates.length}</p>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-md">
            <h3 className="text-white text-xl font-semibold">Total Users</h3>
            <p className="text-white text-3xl">{totalUsers}</p>
          </div>
        </div>
        <Chart
          chartType="PieChart"
          data={[['Candidate', 'Votes'], ...voteData]}
          options={{ title: 'Votes Distribution' }}
          width={'100%'}
          height={'400px'}
          className="mb-6"
        />
        <form onSubmit={handleAddOrEditCandidate} className="mb-6">
          <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700 mb-2">
            {editingCandidate ? 'Edit Candidate' : 'Add Candidate'}
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="candidateName"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="ml-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {editingCandidate ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success:</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}
        <h3 className="text-xl font-bold mb-4">Candidates</h3>
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Votes</th>
              <th className="py-3 px-4 border-b">Percentage</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-t">
                <td className="py-3 px-4 border-b">{candidate.name}</td>
                <td className="py-3 px-4 border-b">{candidate.vote_count}</td>
                <td className="py-3 px-4 border-b">
                  {totalVotes > 0 ? ((candidate.vote_count / totalVotes) * 100).toFixed(2) : 0}%
                </td>
                <td className="py-3 px-4 border-b flex items-center">
                  <button
                    onClick={() => handleEditCandidate(candidate)}
                    className="mr-2 bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCandidate(candidate.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="text-xl font-bold mb-4">Users</h3>
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">NIM</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Vote Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="py-3 px-4 border-b">{user.name}</td>
                <td className="py-3 px-4 border-b">{user.nim}</td>
                <td className="py-3 px-4 border-b">{user.email}</td>
                <td className="py-3 px-4 border-b">
                  <span className={`font-medium ${user.is_online ? 'text-green-500' : 'text-red-500'}`}>
                    {user.is_online ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">{user.has_voted ? 'Has voted' : 'Not voted'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
