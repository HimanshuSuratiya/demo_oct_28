import { render, screen } from "@testing-library/react";
import RootComponentRender from "@/pages/index";
import dayjs from "dayjs";
import useLoginStore from '../redux/loginStore';
import { format } from "date-fns"

jest.mock('../redux/loginStore');

test("Check choose is now Date and date is disabled if user is not authenticated", () => {
  useLoginStore.mockReturnValue({ isAuthenticated: false });
  render(<RootComponentRender />);
  const button = screen.getByText(format(dayjs().toDate(), "PPP"))
  expect(button).toBeInTheDocument()
  expect(button).toHaveAttribute("disabled")
})