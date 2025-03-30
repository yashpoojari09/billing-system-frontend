import LoginForm from "./form";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <div className="bg-dark p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white text-center mb-4">User Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
