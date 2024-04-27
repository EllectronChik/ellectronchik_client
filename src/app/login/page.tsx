import SignUpForm from "@/components/SignUpForm/SignUpForm";
import classes from "./login.module.scss";
import { Metadata } from "next";
import SignInForm from "@/components/SignInForm/SignInForm";

const Login = () => {
  return (
    <main>
      <div className={classes.container}>
        <div className={classes.center}>
          <SignUpForm />
          <div>
            <div className={classes.orContainer} />
            <p className={classes.or}>or</p>
            <div className={classes.orContainer} />
          </div>
          <SignInForm />
        </div>
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Login",
  description: "Login to EllectronChik",
};

export default Login;
