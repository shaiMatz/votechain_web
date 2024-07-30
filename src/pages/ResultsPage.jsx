import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { electionResult } from '../services/electionResult';
import { useGetElection } from '../api/electionService';

const ResultsPage = () => {
    const { electionId } = useParams();
    const [results, setResults] = useState(null);
    const [resultsLoading, setResultsLoading] = useState(true);
    const [resultsError, setResultsError] = useState(null);
    const { data: electionData, loading: electionLoading, error: electionError, getElection } = useGetElection();

    const fetchResults = useCallback(async () => {
        try {
            const data = await electionResult(electionId);
            setResults(data);
            await getElection(electionId);
            
        } catch (err) {
            setResultsError(err);
        } finally {
            setResultsLoading(false);
        }
    }, [electionId, getElection]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    if (resultsLoading || electionLoading) {
        return <p className="text-lg text-gray-700">Loading results...</p>;
    }

    if (resultsError || electionError) {
        return <p className="text-lg text-red-500">Error loading results: {(resultsError || electionError).message}</p>;
    }
 
    return (
        <div className="p-4 md:p-10 min-h-screen">
            <h2 className="text-2xl text-gray-900 font-bold mb-4">Election Results</h2>
            {results ? (
                <div>
                    <h3 className="text-xl text-gray-700 font-semibold">Election ID: {results.election_id.toString()}</h3>
                    <h4 className="text-lg text-gray-700 font-semibold">Election Title: {electionData?.title}</h4>
                    <p className="text-lg text-gray-700 mb-4">Election Dates: {electionData?.start_time} - {electionData?.end_time}</p>
                    {results.candidate_results && results.candidate_results.length > 0 ? (
                        <>
                            <h4 className="text-lg font-semibold mb-2 text-gray-700">Candidates:</h4>
                            <ul className="list-disc list-inside">
                                {results.candidate_results.map(candidate => (
                                    <li key={candidate.candidate_name} className="text-lg text-gray-700">
                                        {candidate.candidate_name}: {candidate.votes.toString()} votes
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-lg text-gray-700">No candidate results available.</p>
                    )}
                </div>
            ) : (
                <p className="text-lg text-gray-700">No results available.</p>
            )}
        </div>
    );
};

export default ResultsPage;
