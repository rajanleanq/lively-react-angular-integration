import { FormEvent, useState } from "react";
import { useAppDispatch } from "../../../hooks";
import { loginWithCredentials } from "../../../store/slices/authSlice";

interface LoginFormData {
  email: string;
  password: string;
}

interface UseLoginFormResult {
  formData: LoginFormData;
  showPassword: boolean;
  loading: boolean;
  error: string;
  handleInputChange: (
    field: keyof LoginFormData
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordVisibility: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleDemoLogin: (isAdmin: boolean) => void;
}

export const useLoginForm = (): UseLoginFormResult => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      if (error) setError("");
    };

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { email, password } = formData;

      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      const isAdmin = email === "admin@gmail.com" && password === "password";
      const isValidUser = email.includes("@") && password.length >= 6;

      if (!isValidUser) {
        throw new Error("Invalid email format or password too short");
      }

      await dispatch(loginWithCredentials({ email, isAdmin })).unwrap();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (isAdmin: boolean) => {
    const demoCredentials = isAdmin
      ? { email: "admin@gmail.com", password: "password" }
      : { email: "user@company.com", password: "password" };
    setFormData(demoCredentials);
  };

  return {
    formData,
    showPassword,
    loading,
    error,
    handleInputChange,
    handleTogglePasswordVisibility,
    handleSubmit,
    handleDemoLogin,
  };
};
