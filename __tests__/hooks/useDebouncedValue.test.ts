import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

describe("useDebouncedValue", () => {
  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("test", 300));
    expect(result.current).toBe("test");
  });

  it("should debounce value changes", async () => {
    vi.useFakeTimers();
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    );

    expect(result.current).toBe("initial");

    // Change value
    rerender({ value: "changed", delay: 300 });
    
    // Should still be initial immediately after change
    expect(result.current).toBe("initial");

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now should have updated
    expect(result.current).toBe("changed");

    vi.useRealTimers();
  });

  it("should use default delay of 300ms", async () => {
    vi.useFakeTimers();
    
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      { initialProps: { value: "initial" } }
    );

    rerender({ value: "changed" });
    
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("changed");

    vi.useRealTimers();
  });
});
