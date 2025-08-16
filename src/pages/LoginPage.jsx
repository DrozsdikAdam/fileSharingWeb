import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const LoginPage = () => {
  const navigate = useNavigate();

  const { user, login } = useUser();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    // Ha a felhasználó már be van jelentkezve, irányítsuk át a főoldalra.
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    //regex: 8 karakter, 1 nagybetű, 1 kisbetű, 1 szám, 1 speciális karakter
    const passwRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwRegex.test(password);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let isFormValid = true;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (email.trim().length === 0) {
      setEmailError("Nem lehet üres!");
      isFormValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Nem megfelelő email formátum!");
      isFormValid = false;
    } else setEmailError("");

    if (password.trim().length === 0) {
      setPasswordError("Nem lehet üres!");
      isFormValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError("Nem megfelelő jelszó formátum!");
      isFormValid = false;
    } else setPasswordError("");

    if (isFormValid) {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      }
    }
  };

  return (
    <div className="text-center border-2 border-indigo-900 w-70 md:w-100 lg:w-150 dark:border-indigo-300 rounded-lg shadow-md scale-110 md:scale-120 lg:scale-130">
      <div className="text-xl font-bold py-4 border-b-2 border-indigo-900 dark:border-indigo-300 cursor-default">
        Bejelentkezés
      </div>
      <div className="px-6">
        <form>
          <div
            className={`flex items-center justify-between flex-col px-3 ${
              emailError === "" ? "py-3" : "pt-3 py-0"
            } `}
          >
            <div className="flex items-center justify-between gap-8">
              <label htmlFor="email" className="font-semibold text-lg">
                Email:
              </label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                title={emailError}
                className={` px-1 outline-none border-b-2 ${
                  emailError === ""
                    ? "border-indigo-900 dark:border-indigo-300"
                    : "border-red-500"
                } `}
              />
            </div>
            {emailError === "" ? null : (
              <p className="text-red-500 w-full text-left italic text-sm opacity-80 pt-1">
                {emailError}
              </p>
            )}
          </div>

          <div
            className={`flex items-center justify-between flex-col px-3 pt-3 ${
              passwordError === "" ? "pb-6" : "pb-3"
            }`}
          >
            <div className="flex items-center justify-between gap-8">
              <label htmlFor="password" className="font-semibold text-lg">
                Jelszó:
              </label>
              <input
                title={passwordError}
                ref={passwordRef}
                type="password"
                id="password"
                className={` px-1 outline-none border-b-2 ${
                  passwordError === ""
                    ? "border-indigo-900 dark:border-indigo-300"
                    : "border-red-500"
                } `}
              />
            </div>

            {passwordError === "" ? null : (
              <p className="text-red-500 w-full italic text-left text-sm opacity-80 pt-1">
                {passwordError}
              </p>
            )}
          </div>
        </form>
      </div>
      <div className="p-3 grid grid-cols-2 border-t-2 gap-3 border-indigo-900 dark:border-indigo-300">
        <div
          onClick={() => navigate("/")}
          className="border-2 cursor-pointer hover:bg-red-400/50 font-semibold text-lg border-indigo-900 dark:border-indigo-300 p-2 rounded-lg"
        >
          Vissza
        </div>
        <button
          onClick={handleClick}
          className="border-2 hover:bg-green-400/50 font-semibold text-lg border-indigo-900 dark:border-indigo-300 p-2 rounded-lg"
        >
          Bejelentkezés
        </button>
      </div>
    </div>
  );
};
