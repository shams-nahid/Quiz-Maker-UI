import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import UserProfile from "../UserProfile";

describe("UserProfile Component", () => {
  test("renders profile with all props", () => {
    render(
      <UserProfile name='John Doe' email='john@example.com' role='admin' />
    );
    expect(screen.getByText("User Profile")).toBeInTheDocument();
    expect(screen.getByText("Name: John Doe")).toBeInTheDocument();
    expect(screen.getByText("Email: john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Role: admin")).toBeInTheDocument();
  });

  test("renders profile with optional props", () => {
    render(<UserProfile />);
    expect(screen.getByText("User Profile")).toBeInTheDocument();
    expect(screen.getByText("No name provided")).toBeInTheDocument();
    expect(screen.getByText("No email provided")).toBeInTheDocument();
    expect(screen.queryByTestId("role")).not.toBeInTheDocument();
  });

  test("renders profile with only name", () => {
    render(<UserProfile name='John Doe' />);
    expect(screen.getByText("User Profile")).toBeInTheDocument();
    expect(screen.getByText("Name: John Doe")).toBeInTheDocument();
    expect(screen.getByText("No email provided")).toBeInTheDocument();
    expect(screen.queryByTestId("role")).not.toBeInTheDocument();
  });

  test("component has correct id", () => {
    render(<UserProfile />);
    expect(screen.getByTestId("user-profile")).toBeInTheDocument();
  });
});
