import { renderHook, waitFor, render } from "@testing-library/react";
import useFetchUser from "../hooks/useFetchUser";
import useLoginStore from "../redux/loginStore";
import axiosInstance from "../api/axiosInstance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../redux/loginStore");
jest.mock("../api/axiosInstance");

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe("useFetchUser", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("returns empty object if user is not authenticated", async () => {
        useLoginStore.mockReturnValue({ isAuthenticated: false, accessToken: null });
        axiosInstance.get.mockResolvedValue({ data: null });
        const { result } = renderHook(() => useFetchUser(), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current).toEqual({}));
    });

    test("fetches user data when user is authenticated", async () => {
        const mockUserData = {
            email: "Himanshu84688@gmail.com",
            name: "Himanshu Suratiya",
        };

        useLoginStore.mockReturnValue({ isAuthenticated: true, accessToken: "12345" });
        axiosInstance.get.mockResolvedValueOnce({ data: mockUserData });
        const { result } = renderHook(() => useFetchUser(), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current).toEqual(mockUserData));
        expect(axiosInstance.get).toHaveBeenCalledWith("https://www.googleapis.com/oauth2/v2/userinfo");
    });

    test("returns empty object if fetching user data fails", async () => {
        useLoginStore.mockReturnValue({ isAuthenticated: true, accessToken: "some-token" });
        axiosInstance.get.mockRejectedValue(new Error("Network error"));
        const { result } = renderHook(() => useFetchUser(), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current).toEqual({}));
    });
});