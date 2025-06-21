import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LunchItemCard from "../../pages/UserDashboard/component/LunchItemCard";
import { LunchItem } from "../../types";

const mockItem: LunchItem = {
  id: "1",
  name: "Caesar Salad",
  price: 12.99,
  description: "Fresh romaine lettuce with parmesan and croutons",
  category: "Salads",
  available: true,
};

describe("LunchItemCard", () => {
  it("renders item information correctly", () => {
    render(
      <LunchItemCard item={mockItem} isSelected={false} showAddButton={true} />
    );

    expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
    expect(screen.getByText("12.99")).toBeInTheDocument();
    expect(
      screen.getByText("Fresh romaine lettuce with parmesan and croutons")
    ).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("shows unavailable status for unavailable items", () => {
    const unavailableItem = { ...mockItem, available: false };

    render(
      <LunchItemCard
        item={unavailableItem}
        isSelected={false}
        showAddButton={true}
      />
    );

    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });

  it("calls onAddToOrder when add button is clicked", () => {
    const mockOnAddToOrder = vi.fn();

    render(
      <LunchItemCard
        item={mockItem}
        onAddToOrder={mockOnAddToOrder}
        isSelected={false}
        showAddButton={true}
      />
    );

    const addButton = screen.getByRole("button", {
      name: /add caesar salad to order/i,
    });
    fireEvent.click(addButton);

    expect(mockOnAddToOrder).toHaveBeenCalledWith(mockItem);
  });

  it('shows "Added" state when item is selected', () => {
    render(
      <LunchItemCard item={mockItem} onAddToOrder={vi.fn()} isSelected={true} showAddButton={true} />
    );

    expect(screen.getByText("Added")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not show add button when showAddButton is false", () => {
    render(
      <LunchItemCard item={mockItem} isSelected={false} showAddButton={false} />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not show add button for unavailable items", () => {
    const unavailableItem = { ...mockItem, available: false };

    render(
      <LunchItemCard
        item={unavailableItem}
        isSelected={false}
        showAddButton={true}
      />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
