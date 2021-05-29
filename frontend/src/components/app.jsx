import React, { useState, useEffect } from 'react';

import {
  f7,
  f7ready,
  App,
  View,
} from 'framework7-react';

import {useAuth} from '../hooks/auth'

// import {useRoutes} from '../js/routes';
import routes from '../js/routes';
import store from '../js/store';

import {Loader} from "./loadPage"

function setLocation(curLoc){
    try {
        history.pushState(null, null, curLoc);
        return;
    } catch(e) {}
    location.hash = '#' + curLoc;
}

const MyApp = () => {

    let {token, refresh, login, logout, userId, ready} = useAuth()
    let isAuthenticated = !!token
    //let routes = useRoutes(isAuthenticated)

    let redirector = (object) => {
        let router = f7.views.main.router
        let user = f7.params.user
        if (object != undefined){
            if (object.to.name != object.from.name){
                if (user.isAuthenticated) {
                    if (object.to.name == "login" ||
                        object.to.name == "register"){
                        object.reject()
                        router.navigate({name:"home"})
                    } else object.resolve()
                } else {
                    if (object.to.name == "login" ||
                        object.to.name == "register"){
                        object.resolve()
                    } else {
                        object.reject()
                        router.navigate({name:"login"})
                    }
                }
            }
        } else {
            if (user.isAuthenticated) {
                if (window.location.pathname == "/login" ||
                    window.location.pathname == "/register"){
                    router.navigate({name:"home"})
                }
            } else {
                if (window.location.pathname != "/login" ||
                    window.location.pathname != "/register"){
                    router.navigate({name:"login"})
                }
            }
        }
    }


  // Framework7 Parameters
  let f7params = {
    user: {token, refresh, login, logout, userId, ready, isAuthenticated},
    name: 'VOL Messenger', // App name
      theme: 'aurora', // Automatic theme detection
      // App store
      store: store,
      // App routes
      routes: routes,
      // Register service worker
      serviceWorker: {
        path: '/service-worker.js',
      },
    view: {
      browserHistory: true,
      browserHistorySeparator: "",
      //pushState: true,
        routesBeforeEnter({to,from,resolve,reject}){
            redirector({to,from,resolve,reject})
        }
    },
    on: {
      pageBeforeIn(){
          redirector()
      }
    },
  };

  f7ready(() => {
      f7.params.user = {token, refresh, login, logout, userId, ready, isAuthenticated}
  });

  return (
      <App { ...f7params }>
          {ready && (
              <View main className="safe-areas" url="/" />
          )}
      </App>
  );
}
export default MyApp;