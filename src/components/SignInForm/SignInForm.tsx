"use client";

import { useState } from "react";
import classes from "./SignInForm.module.scss";
import Image from "next/image";
import eye from "@/assets/images/eye.svg";
import eyeClosed from "@/assets/images/eye-closed.svg";
import { gql, useMutation } from "@apollo/client";
import generateHash from "@/actions/generateHash";
import { useRouter } from "next/navigation";

interface LoginData {
  login: boolean;
}

interface LoginVariables {
  name: string;
  password: string;
}

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleShowPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword((prevState) => !prevState);
  };

  const LOGIN = gql`
    mutation Login($name: String!, $password: String!) {
      login(loginUserInput: { name: $name, password: $password })
    }
  `;

  const [login, { loading, error }] = useMutation<
    LoginData,
    LoginVariables
  >(LOGIN, {
    errorPolicy: "all",
    onError: (error) => {
      if (error) {
        let message: string[] = ["Something went wrong"];
        try {
          message = JSON.parse(error.message).flat();
          message.forEach(
            (err, i) =>
              (message[i] = err.charAt(0).toUpperCase() + err.slice(1))
          );
        } catch (err) {
          message = [error.message];
        }
        setErrors(message);
      }
    },
    onCompleted: async (data) => {
      if (data?.login) {
        const hash = await generateHash(password);
        if (hash) {
        router.push("/diary");
        }
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({
      variables: {
        name: username,
        password: password,
      },
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1 className={classes.title}>Sign In</h1>
        <p className={classes.subtitle}>Enter your details below</p>
      </div>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          <label className={classes.label} htmlFor="in_username">
            Username
          </label>
          <input
            onChange={handleUsernameChange}
            className={classes.input}
            type="text"
            name="username"
            id="in_username"
            placeholder="Username"
          />
        </div>
        <div className={classes.inputContainer}>
          <label className={classes.label} htmlFor="in_password">
            Password
          </label>
          <input
            onChange={handlePasswordChange}
            className={classes.input}
            type={showPassword ? "text" : "password"}
            name="password"
            id="in_password"
            placeholder="Password"
          />
          <button
            className={classes.showPassword}
            onClick={(e) => handleShowPassword(e)}
          >
            {showPassword ? (
              <Image src={eye} alt="eye" width={20} height={20} />
            ) : (
              <Image src={eyeClosed} alt="eye-closed" width={20} height={20} />
            )}
          </button>
        </div>
        <div className={classes.errorContainer}>
          {error &&
            errors.map((error, index) => (
              <p className={classes.error} key={index}>
                {error}
              </p>
            ))}
          {loading && <p className={classes.error}>Loading...</p>}
        </div>
        <button className={classes.submitButton} type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
