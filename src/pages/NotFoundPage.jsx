import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-center">
            <div className="max-w-md">
                <h1 className="text-7xl font-extrabold text-gray-800 mb-4 animate-pulse">404</h1>
                <p className="text-xl text-gray-600 mb-6">Oops! The page you’re looking for doesn’t exist.</p>
                <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    <FiHome className="mr-2 text-2xl" />
                    Go back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
