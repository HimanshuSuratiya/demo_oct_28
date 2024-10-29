import React from 'react';
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import useLoginStore from "../redux/loginStore";

const LoginWithGoogle = (props) => {
    const { toggleAuth, setAccessToken } = useLoginStore();

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            const accessToken = tokenResponse.access_token;
            toggleAuth()
            setAccessToken(accessToken)
        },
        onError: (error) => {
        },
        scope: 'https://www.googleapis.com/auth/calendar',
    });

    return <Button onClick={login} variant="outline">Login</Button>
}

export default LoginWithGoogle;