// Footer.js
import useAuth from '../hooks/useAuth';

const Footer = () => {
    const { user } = useAuth();
    const username = user.role === 'voter' ? user.username : 'votechain111'; // Conditional check

    return (
        <footer className="pt-4 mt-auto relative bottom-0 text-center">
            Tools to explore the blockchain:
            <div className="container mx-auto px-4 flex justify-center flex-wrap space-x-6">
                <a
                    href={`https://jungle4.cryptolions.io/v2/explore/account/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 transition duration-200"
                >
                    CryptoLions Account
                </a>
                <a
                    href="https://jungle4.eosq.eosnation.io/account/votechain111/abi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 transition duration-200"
                >
                    EOSQ ABI
                </a>
                <a
                    href="https://jungle.antelope.tools/accounts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 transition duration-200"
                >
                    Antelope Tools
                </a>
            </div>
        </footer>
    );
};

export default Footer;
