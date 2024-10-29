import useLoginStore from "../redux/loginStore";
import { useEffect, useState } from "react";
import { fetchUser } from "../api/api";
import useUserStore from "../redux/userStore";

const useFetchUser = (props) => {
    const { isAuthenticated, accessToken } = useLoginStore();
    const [data, setData] = useState(null)
    const { setUser } = useUserStore();

    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated) {
                const data = await fetchUser()
                setData(data?.data)
                const info = data?.data
                setUser({ name: info.name, email: info.email, picture: info.picture })
            }
        }
        fetchData()
    }, [isAuthenticated]);

    return data?.data || {}
}

export default useFetchUser;