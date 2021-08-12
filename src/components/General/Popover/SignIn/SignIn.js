import React, { useState, useEffect, useContext } from 'react'
import { Form, Button } from 'react-bootstrap'
import TextInput from '../../FormComponents/TextInput';
import ErrorMessage from '../../FormComponents/ErrorMsg';
import MySpinner from '../../MySpinner'
import { inputChangeHandler } from '../../../../utils/handlers';
import { validateInput, isFormValid } from '../../../../utils/validations'
import { login } from '../../../../DAL/users'
import userContext from '../../../../utils/AuthContext';
import Cookies from "js-cookie"; // flask

export default function SignIn() {
    const [loader, setLoader] = useState(false)
    const [disableBtn, setDisableBtn] = useState(true)
    const [loginData, setLoginData] = useState({
        username: {
            value: '',
            error: '',
        },
        password: {
            value: '',
            error: '',
        }
    })

    const [loginResult, setLoginResult] = useState({})
    const context = useContext(userContext)

    useEffect(() => {
        setDisableBtn(!isFormValid(loginData))
    }, [loginData])

    async function loginSubmit(e) {
        e.preventDefault()
        if (isFormValid(loginData)) {
            setLoader(true)
            const loginRes = await login({ username: loginData.username.value, password: loginData.password.value })
            setLoginResult(loginRes)
            setLoader(false)

            if (loginRes.id) {
                context.setLoggedUser(loginRes);
                Cookies.set('fsCookie', loginRes.id) // flask
            }
        } else {
            setLoginData({
                ...loginData,
                password: {
                    ...loginData['password'],
                    value: '',
                }
            })
            setLoginResult('Incorrect Username/Password')
        }
    }

    return (
        <>
            <Form onSubmit={loginSubmit}>
                <TextInput controlId='username'
                    label="Username"
                    type='text'
                    placeholder='Enter Username'
                    name='username'
                    value={loginData.username.value}
                    error={loginData.username.error}
                    onChange={(e) => {
                        setLoginResult({})
                        setLoginData(inputChangeHandler(e, loginData))
                    }}
                    onBlur={(e) => setLoginData(validateInput(e, loginData))} />

                <TextInput controlId="password"
                    label="Password"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={loginData.password.value}
                    error={loginData.password.error}
                    onChange={(e) => {
                        setLoginResult({})
                        setLoginData(inputChangeHandler(e, loginData))

                    }}
                    onBlur={(e) => setLoginData(validateInput(e, loginData))} />

                <Button variant="primary" type="submit" className='d-block mx-auto wider-btn' disabled={disableBtn}>
                    Sign in
                </Button>
                {typeof loginResult === 'string' ? <ErrorMessage error={loginResult} /> : null}
                {loader && <MySpinner />}
            </Form>
        </>
    )
}
