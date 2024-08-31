import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { useRouter } from 'next/router';

export default function UserVotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: candidates, error } = await supabase.from('candidates').select('*');
      if (error) {
        console.error('Error fetching candidates:', error);
        setError('Failed to fetch candidates.');
        return;
      }
      setCandidates(candidates);
    };

    fetchData();
  }, []);

  const handleVote = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      setError('User not found. Please log in again.');
      router.push('/user/login');
      return;
    }

    if (user.has_voted) {
      setError('You have already voted.');
      return;
    }

    try {
      const { error: voteError } = await supabase
        .from('votes')
        .insert([{ user_id: user.id, candidate_id: selectedCandidateId }]);

      if (voteError) {
        console.error('Error inserting vote:', voteError);
        setError('Failed to submit your vote. Please try again.');
        return;
      }

      const { error: userError } = await supabase
        .from('users')
        .update({ has_voted: true })
        .eq('id', user.id);

      if (userError) {
        console.error('Error updating user:', userError);
        setError('Failed to update user status. Please try again.');
        return;
      }

      const { error: candidateError } = await supabase
        .rpc('increment_vote_count', { row_id: selectedCandidateId });

      if (candidateError) {
        console.error('Error updating candidate vote count:', candidateError);
        setError('Failed to update vote count. Please try again.');
        return;
      }

      user.has_voted = true;
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/thank-you');
    } catch (err) {
      console.error('An unexpected error occurred:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Vote for Your Candidate</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleVote}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidateId(candidate.id)}
                className={`cursor-pointer p-4 rounded-lg shadow-md text-center transition transform hover:scale-105 duration-200 ${
                  selectedCandidateId === candidate.id ? 'bg-violet-600 text-white' : 'bg-white text-black'
                }`}
              >
                <p className="text-lg font-semibold">{candidate.name}</p>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-3 px-4 rounded-lg hover:bg-violet-700 transition duration-300"
          >
            Submit Vote
          </button>
        </form>
      </div>
    </div>
  );
}