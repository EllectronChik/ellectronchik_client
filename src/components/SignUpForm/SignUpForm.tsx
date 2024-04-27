"use client";

import { useState } from "react";
import classes from "./SignUpForm.module.scss";
import Image from "next/image";
import eye from "@/assets/images/eye.svg";
import eyeClosed from "@/assets/images/eye-closed.svg";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";


interface RegisterData {
  register: boolean;
}

interface RegisterVariables {
  name: string;
  password: string;
}

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const REG = gql`
    mutation Register($name: String!, $password: String!) {
      register(createUserInput: { name: $name, password: $password })
    }
  `;

  const [register, { loading, error }] = useMutation<
    RegisterData,
    RegisterVariables
  >(REG, {
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
    onCompleted: (data) => {
      if (data?.register) {
        router.push("/diary");
      }
    },
  });

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordMatch(event.target.value === password);
    setConfirmPassword(event.target.value);
  };

  const handleShowPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword((prevState) => !prevState);
  };

  const handleShowConfirmPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setShowConfirmPassword((prevState) => !prevState);
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (password === confirmPassword) {
      register({ variables: { name: username, password } });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1 className={classes.title}>Sign Up</h1>
        <p className={classes.subtitle}>Enter your details below</p>
      </div>
      <form className={classes.form}>
        <div className={classes.inputContainer}>
          <label className={classes.label} htmlFor="up_username">
            Username
          </label>
          <input
            onChange={handleUsernameChange}
            className={classes.input}
            type="text"
            name="username"
            id="up_username"
            placeholder="Username"
          />
        </div>
        <div className={classes.inputContainer}>
          <label className={classes.label} htmlFor="up_password">
            Password
          </label>
          <input
            onChange={handlePasswordChange}
            className={classes.input}
            type={showPassword ? "text" : "password"}
            name="password"
            id="up_password"
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
        <div className={classes.inputContainer}>
          <label className={classes.label} htmlFor="up_confirmPassword">
            Confirm Password
          </label>
          <input
            onChange={handleConfirmPasswordChange}
            className={classes.input}
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            id="up_confirmPassword"
            placeholder="Confirm password"
          />
          <button
            className={classes.showPassword}
            onClick={(e) => handleShowConfirmPassword(e)}
          >
            {showConfirmPassword ? (
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
          {!passwordMatch && confirmPassword !== "" && (
            <p className={classes.error}>Passwords do not match</p>
          )}
          {loading && <p className={classes.error}>Loading...</p>}
        </div>
        <button
          onClick={handleSubmit}
          className={classes.submitButton}
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
