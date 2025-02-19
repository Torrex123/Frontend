import {BiMessageRoundedDetail} from 'react-icons/bi';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/AuthStore';

interface ThemeStore {
    theme: string;
    setTheme: (theme: string) => void;
}

interface AuthStore {
    user: any;
}

const Navbar = () => {

    const {user} = useAuthStore() as AuthStore;

    const {theme, setTheme } = useThemeStore() as ThemeStore;

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'coffee' : 'light';
        setTheme(newTheme);
    };

    return (
        <div className="flex justify-between items-center px-20 py-4 border-b border-base">
            {/* Left section with logo and project name */}
            <div className="flex items-center space-x-2">
                <BiMessageRoundedDetail className="text-4xl" />
                <span className="text-3xl font-bold">QueMas?</span>
            </div>

            {/* Right section with settings button */}
            <button onClick={toggleTheme} className="btn btn-primary px-11 py-2 rounded">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>

            <div className="flex items-center space-x-2">
                {user ? (
                    <div className="flex items-center space-x-2">
                        <span>{user.nickName}</span>
                        <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                    </div>
                ) : (
                    <a href="/login" className="btn btn-primary">Login</a>
                )}
            </div>
        </div>
    );
}

export default Navbar