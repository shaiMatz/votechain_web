import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useGetElection } from '../api/electionService';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { electionResult } from '../services/electionResult';

const ResultsPage = () => {
    const { electionId } = useParams();
    const [electionData, setElectionData] = useState(null);
    const [resultsLoading, setResultsLoading] = useState(true);
    const [resultsError, setResultsError] = useState(null);
    const { getElection } = useGetElection();

    const fetchResults = useCallback(async () => {
        setResultsLoading(true); // Start loading
        try {
            const election = await getElection(electionId);
            console.log('election', election);
            setElectionData(election.data);

            const result = await electionResult(electionId);
            console.log(result)
        } catch (err) {
            setResultsError(err);
        } finally {
            setResultsLoading(false); // End loading
        }
    }, [electionId, getElection]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    const getWinner = (candidates) => {
        return candidates.sort((a, b) => b.votes - a.votes)[0];
    }

    const getRestCandidates = (candidates) => {
        return candidates.sort((a, b) => b.votes - a.votes).slice(1);
    }

    const chartData = electionData?.candidates.map((candidate, index) => ({
        name: candidate.name,
        votes: candidate.votes,
        rank: index + 1
    }));

    return (
        <div className="p-4 md:p-10 min-h-screen">
            <Navbar />
            <div className="mt-6 px-6">
                <h2 className="text-3xl font-bold text-primary">
                    Election Results {electionData && `- ${electionData.name}`}
                </h2>
                {electionData && <p className="text-md text-gray-600">{electionData.startdate} to {electionData.enddate}</p>}

                {resultsLoading ? (
                    <p className="text-lg text-gray-700">Loading results...</p>
                ) : (
                    <>
                        {resultsError ? (
                            <p className="text-lg text-red-500">Error loading results: {resultsError.message || 'Unknown error'}</p>
                        ) : (
                            <>
                                {electionData && electionData.candidates ? (
                                    <>
                                        <div className="mt-8 text-center">
                                            <h3 className="text-2xl font-bold mb-4 text-black">Winner</h3>
                                            <div className="p-6 shadow-xl border rounded text-gray-700 flex flex-col items-center border-secondary-200 mx-auto max-w-sm">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-secondary-300">1</div>
                                                <h3 className="text-2xl font-semibold text-black mt-2">{getWinner(electionData.candidates).name}</h3>
                                                        <p className="text-lg text-gray-700">{getWinner(electionData.candidates).party}</p>
                                                <p className="text-md text-black">Votes: {getWinner(electionData.candidates).votes}</p>
                                            </div>
                                        </div>
                                        <div className="mt-12">
                                            <h3 className="text-xl font-semibold mb-6 text-black">Other Candidates</h3>
                                            <div className="space-y-4">
                                                {getRestCandidates(electionData.candidates).map((result, index) => (
                                                    <div key={result.id} className="p-4 bg-white  shadow-sm text-gray-700 flex items-center">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold bg-gray-300 mr-4">{index + 2}</div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-black">{result.name}</h3>
                                                            <p className="text-xl text-gray-700">{result.party}</p>

                                                            <p className="text-md text-black">Votes: {result.votes}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-12">
                                            <h3 className="text-xl font-semibold mb-6 text-black">Election Results Chart</h3>
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={chartData} layout="vertical">
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis type="number" />
                                                    <YAxis dataKey="name" type="category" />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="votes" fill="#8884d8" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-lg text-gray-700">No results available at the moment. Please check back later.</p>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;
