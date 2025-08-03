import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import Home from "./page";

function renderWithRedux(component: React.ReactElement) {
  return render(<Provider store={store}>{component}</Provider>);
}

describe("Home Page", () => {
  it("renders counter and buttons", () => {
    renderWithRedux(<Home />);

    expect(screen.getByText(/Counter: 0/)).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("increments counter when + button is clicked", () => {
    renderWithRedux(<Home />);

    const incrementButton = screen.getByText("+");
    fireEvent.click(incrementButton);

    expect(screen.getByText(/Counter: 1/)).toBeInTheDocument();
  });
});
