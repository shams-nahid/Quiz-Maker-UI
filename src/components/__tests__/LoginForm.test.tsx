import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../LoginForm";
import { act } from "react";

describe("LoginForm Component", () => {
  test("renders LoginForm correctly", () => {
    render(<LoginForm />);
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("validates required fields on submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: "Login" });
    await user.click(submitButton);

    expect(screen.getByTestId("email-error")).toHaveTextContent(
      "Email is required"
    );

    expect(screen.getByTestId("password-error")).toHaveTextContent(
      "Password is required"
    );
  });

  test("validates email format", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email")
      ).toBeInTheDocument();
    });
  });
});
