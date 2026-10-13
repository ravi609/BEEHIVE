import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HUDNavigation from "./HUDNavigation";

describe("HUDNavigation", () => {
  it("renders the BEEHIVE logo and not ACTIVE THEORY", () => {
    render(
      <MemoryRouter>
        <HUDNavigation />
      </MemoryRouter>
    );

    expect(screen.getByText("BEE")).toBeInTheDocument();
    expect(screen.getByText("HIVE")).toBeInTheDocument();
    expect(screen.queryByText("ACTIVE")).not.toBeInTheDocument();
    expect(screen.queryByText("THEORY")).not.toBeInTheDocument();
  });
});
