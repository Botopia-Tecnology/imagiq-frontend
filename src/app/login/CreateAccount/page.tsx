import CreateAccountForm from "./CreateAccount";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] py-10">
      <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <CreateAccountForm />
      </div>
    </div>
  );
}
