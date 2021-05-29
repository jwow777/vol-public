import React, { useState } from 'react';
import {
    f7,
    Page,
    LoginScreenTitle,
    BlockFooter, Button, Link, Input, Block
} from 'framework7-react';
import i18n from '../js/i18nextConf';
import {withTranslation} from "react-i18next";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import Logo from '../static/images/loginpage_logo.svg'

export default withTranslation()(({ t }) => {
    // const [phone, setPhone] = useState('');
    // const [country, setCountry] = useState('');
    // const [formatted, setFormatted] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signIn = () => {
        if (email != "" && password != "") {
            let headers = new Headers()
            headers.append("Content-Type", "application/x-www-form-urlencoded")

            let body = new URLSearchParams()
            body.append("grant_type", "password")
            body.append("client_id", "vol_web")
            body.append("client_secret", "IncrediblySecret")
            body.append("username", email)
            body.append("password", password)

            fetch("http://localhost:3000/api/oauth/token", {
                method: 'POST',
                headers,
                body,
                redirect: 'follow'
            })
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(
                    (result) => {
                        console.log(result);
                        f7.params.user.login(result)
                        f7.views.main.router.navigate({ name: "home" })
                    },
                    (error) => {
                        f7.dialog.alert(`Неверный логин или пароль`)
                    }
                ).catch(() => f7.dialog.alert(`Неверный логин или пароль`))
        }     
    }

    return (
        <Page noToolbar noNavbar noSwipeback loginScreen className={"vol_login_page"}>
            <LoginScreenTitle><img src={Logo} alt=""/></LoginScreenTitle>
            <Block
                className="vol_login_form"
            >
                <Input
                    outline
                    label={t("login.email_label")}
                    floatingLabel
                    type="email"
                    placeholder={t("login.email_placeholder")}
                    clearButton
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                >
                </Input>
                <Input
                    outline
                    label={t("login.password_label")}
                    floatingLabel
                    type="password"
                    placeholder={t("login.password_placeholder")}
                    clearButton
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                >
                </Input>
            </Block>
            {/*<PhoneInput*/}
            {/*    inputProps={{*/}
            {/*        name: 'phone',*/}

            {/*    }}*/}
            {/*    countryCodeEditable={false}*/}
            {/*    country={'ru'}*/}
            {/*    value={phone}*/}
            {/*    onChange={(phone, country, e, formatted) => {*/}
            {/*        console.log(phone, country, formatted)*/}
            {/*        setPhone(phone)*/}
            {/*        setCountry(country.countryCode)*/}
            {/*        setFormatted(formatted)*/}
            {/*    }}*/}
            {/*/>*/}
            <Button onClick={signIn} fill>{t("login.login_button")}</Button>
            <BlockFooter>
                Some text about login information.
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </BlockFooter>
        </Page>
    );
});
