import useLoginStore from "../redux/loginStore";
import {useQuery} from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

const useFetchUser = () => {
  const {isAuthenticated, accessToken} = useLoginStore();
  const {data} = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      return axiosInstance.get('https://www.googleapis.com/oauth2/v2/userinfo',)
    },
    enabled: isAuthenticated
  })

  return data?.data || {}
}

export default useFetchUser;