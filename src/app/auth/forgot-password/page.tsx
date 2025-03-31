import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordPage=()=>{
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <div className="bg-dark p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-white text-center mb-4">Forgot Password</h2>
      <ForgotPasswordForm />
    </div>
    </div>
  );
}
export default ForgotPasswordPage;