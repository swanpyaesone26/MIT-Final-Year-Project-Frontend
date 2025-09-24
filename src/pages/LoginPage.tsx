import GoogleLoginButton from '../components/auth/GoogleLoginButton';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in using your Google account
          </p>
        </div>
        
        <div className="mt-8">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;