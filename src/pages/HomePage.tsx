import { useAuthStore } from '../store/authStore';

const HomePage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to the Dashboard
          </h1>
          
          {user && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                User Information:
              </h2>
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.pk}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;