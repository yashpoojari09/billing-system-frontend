import LoginForm from "./form";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary px-4">
      <div className="bg-dark p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4">
          User Login
        </h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
