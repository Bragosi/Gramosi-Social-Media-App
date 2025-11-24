import { Link } from "react-router-dom";
import logo from '../../public/logo.png';

const Header = () => {
  return (
    <header className="md:hidden fixed top-0 left-0 w-full h-16 z-40 bg-n-8 border-b border-n-6 backdrop-blur-sm bg-opacity-75 overflow-x-hidden">
      <div className="flex items-center justify-between h-full px-4 w-full max-w-full overflow-hidden">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 truncate">
          <img src={logo} alt="gramosi logo" className="w-10 h-10 object-contain" />
          <h1 className="text-xl font-sans text-gray-700 truncate">Gramosi</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
