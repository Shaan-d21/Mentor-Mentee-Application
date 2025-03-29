import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900 p-6">
            <div className="relative w-full max-w-md bg-white p-8 rounded-lg shadow-lg backdrop-blur-md bg-opacity-90">
                {children}
            </div>
        </div>
    );
};

export default Layout;