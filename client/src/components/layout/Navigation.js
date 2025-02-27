import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LanguageSelector from '../common/LanguageSelector';

const Navigation = () => {
  return (
    <nav>
      <div className="flex items-center space-x-4">
        <LanguageSelector />
        <ThemeToggle />
        {/* ... other navigation items ... */}
      </div>
    </nav>
  );
};

export default Navigation; 