import { Link } from 'react-router-dom';
import Button from '../shared/Button';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-bsy-primary">
            Black Swan Yoga
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-bsy-primary">
              Find a Class
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-bsy-primary">
              Dashboard
            </Link>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 