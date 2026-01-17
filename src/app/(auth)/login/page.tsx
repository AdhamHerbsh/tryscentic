import LoginForm from "@/components/ui/Forms/LoginForm";


export default function Login() {

  return (
    <>
      <div className="min-h-screen flex items-center justify-center py-20 bg-primary"
        style={{

          backgroundImage: "url('/assets/images/login-background.png')",
          backgroundSize: "cover",
        }}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center p-4">
            <LoginForm />
          </div>
        </div>
      </div >
    </>
  );
}
