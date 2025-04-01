export default () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in">
          Welcome to <span className="text-blue-400">Mentor Mentee</span> Application
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in">
          Empowering connections between mentors and mentees for a brighter future.
        </p>
        <div className="flex justify-center">
          <a
            href="/auth/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* Logo Section */}
      <div className="mt-12 animate-fade-in">
        <div className="flex items-center justify-center">
          <img
            src="/images/Mentor-Mentee.png"
            alt="Mentor Mentee Logo"
            className="w-64 md:w-96 mx-auto drop-shadow-lg"
          />
        </div>
      </div>

      {/* Footer Section */}
      
    </div>
  );
};
