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
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Vote for Your Candidate</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleVote} className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {candidates.map((candidate) => (
            <button
              type="button"
              key={candidate.id}
              onClick={() => setSelectedCandidateId(candidate.id)}
              className={`py-2 px-4 border rounded-md text-center ${
                selectedCandidateId === candidate.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {candidate.name}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
        >
          Submit Vote
        </button>
      </form>
    </div>
  );
}