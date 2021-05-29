import {useState, useCallback, useEffect} from 'react'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [refresh, setRefresh] = useState(null)
    const [tokenTime, setTokenTime] = useState(null)
    const [ready, setReady] = useState(false)

    const login = useCallback((data) => {
        if (data.tokenTime) {
            if (((new Date() - new Date(data.tokenTime)) / 1000) < 3600) {
                setToken(data.token)
                setRefresh(data.refresh)
                setTokenTime(data.tokenTime)

                localStorage.setItem('token', data.token)
                localStorage.setItem('refresh', data.refresh)
                localStorage.setItem('tokenTime', data.tokenTime)
            } else {
                let headers = new Headers()
                headers.append("Content-Type", "application/x-www-form-urlencoded")

                let body = new URLSearchParams()
                body.append("grant_type", "refresh_token")
                body.append("client_id", "vol_web")
                body.append("client_secret", "IncrediblySecret")
                body.append("refresh_token", data.refresh)

                fetch("http://localhost:3000/api/oauth/token", {
                        method: 'POST',
                        headers,
                        body,
                        redirect: 'follow'
                    })
                    .then(res => res.ok ? res.json() : Promise.reject(res))
                    .then(
                        (result) => {
                            login(result)
                        },
                        (error) => {
                            logout()
                        }
                    ).catch(() => logout())
            }
        } else {
            if (data.expires_in) {
                setToken(data.access_token)
                setRefresh(data.refresh_token)
                setTokenTime(new Date())

                localStorage.setItem('token', data.access_token)
                localStorage.setItem('refresh', data.refresh_token)
                localStorage.setItem('tokenTime', new Date())
            }
        }
    }, [])


    const logout = useCallback(() => {
        setToken(null)
        setRefresh(null)
        setTokenTime(null)
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
        localStorage.removeItem('tokenTime')
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token')
        const refresh = localStorage.getItem('refresh')
        const tokenTime = localStorage.getItem('tokenTime') || null

        const data = {token, refresh, tokenTime}

        if (token) {
            login(data)
        }
        setReady(true)
    }, [login])


    return { login, logout, token, refresh, tokenTime, ready }
}