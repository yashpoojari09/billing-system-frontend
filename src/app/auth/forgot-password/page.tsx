import ForgotPasswordForm from "./ForgotPasswordForm";


const ForgotPasswordPage=()=>{
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <div className="bg-dark p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-96">
      <h2 className="text-2xl font-bold text-white text-center mb-4">Forgot Password</h2>
      <ForgotPasswordForm />
    </div>
    </div>
  );
}
export default ForgotPasswordPage;