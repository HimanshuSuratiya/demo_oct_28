import {render, screen} from "@testing-library/react";
import RootComponentRender from "@/pages/index";

test("Check Root Component Render", () => {
  render(<RootComponentRender/>);
  const labelElement = screen.getByText(/choose date/i);
  expect(labelElement.tagName).toBe("LABEL");
});
