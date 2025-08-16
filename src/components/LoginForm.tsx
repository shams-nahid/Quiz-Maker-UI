import { FormEvent, useState } from "react";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  onSuccess?: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm({ onSubmit, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): string | undefined => {
    console.log("Validating email:", `"${email}"`);
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    console.log("Email regex test result:", isValid);
    if (!isValid) return "Please enter a valid email";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("=== Form Submit Debug ===");
    console.log("Current email state:", email);
    console.log("Current password state:", password);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    console.log("Email error:", emailError);
    console.log("Password error:", passwordError);

    const newErrors: FormErrors = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    console.log("New errors object:", newErrors);
    setErrors(newErrors);
    console.log("=== End Debug ===");

    if (emailError || passwordError) {
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit?.({ email, password });
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid='login-form'>
      <h2>Login</h2>
      <div>
        <label htmlFor='email'>Email:</label>
        <input
          id='email'
          data-testid='email-input'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {errors?.email && (
          <div data-testid='email-error' role='alert'>
            {errors.email}
          </div>
        )}
      </div>
      <div>
        <label htmlFor='password'>Password:</label>
        <input
          id='password'
          data-testid='password-input'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {errors?.password && (
          <div data-testid='password-error' role='alert'>
            {errors.password}
          </div>
        )}
      </div>
      <div>
        <button
          type='submit'
          disabled={isSubmitting}
          data-testid='submit-button'
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
