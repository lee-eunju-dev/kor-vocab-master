import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import Home from "@/app/page";

test("홈 화면은 타이틀과 시작하기 버튼을 보여준다", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", { level: 1, name: "어휘 냥냥" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "시작하기" })
  ).toBeInTheDocument();
});
