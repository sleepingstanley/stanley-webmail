import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Provider } from 'react-redux';

import store from '../store';
import { Socket, SocketContext } from '../modules/client';

import 'semantic-ui-css/semantic.min.css';
import '../stylesheets/App.css';

import { Container } from 'semantic-ui-react';

import Auth from '../modules/auth';

import Home from './views/Home';
import Login from './views/Login';
import Logout from './views/Logout';
import ViewEmail from './views/ViewEmail';
import Error from './views/Error';

import AppNavbar from './AppNavbar';
import Page from './Page';

import { library } from '@fortawesome/fontawesome-svg-core';
//import { fab } from '@fortawesome/free-brands-svg-icons'
import { fal } from '@fortawesome/pro-light-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
//import { far } from '@fortawesome/pro-regular-svg-icons';

library.add(/*fab, */fas, fal/*, far*/);

/*const routes = [
  {
    path: '/',
    exact: true,
    auth: Home,
    noAuth: <Redirect to='/login' />
  }, {
    path: '/login',
    auth: <Redirect to='/' />,
    noAuth: Login
  }, {
    path: '/logout',
    auth: Logout,
    noAuth: <Redirect to='/' />
  }, {
    path: '/view/:email/:extra?',
    auth: ViewEmail,
    noAuth: <Redirect to='/' />
  }
];*/

class App extends Component {
  render() {
    let loggedIn = Auth.isUserAuthenticated();
    return (
      <SocketContext.Provider>
        <Provider store={store}>
          <div className='App'>
            <AppNavbar />
            <Container style={{ marginTop: '7em' }}>
              <Page socket={Socket}>
                <Switch>
                  {/*
                    routes.map((data, index) => {
                      return (<Route key={index} exact={data.exact || false} path={data.path} render={props => data.noAuth ? (Auth.isUserAuthenticated() ? data.auth instanceof Component ? data.auth : <data.auth {...props} /> : data.noAuth instanceof Component ? data.noAuth : <data.noAuth {...props} />) : data.auth instanceof Component ? data.auth : <data.auth {...props} />} />)
                    })
                  */}
                  <Route exact path='/' render={props => loggedIn ? <Home {...props} /> : <Redirect to='/login' />} />
                  <Route path='/login' render={props => loggedIn ? <Redirect to='/' /> : <Login {...props} />} />
                  <Route path='/logout' render={props => loggedIn ? <Logout {...props} /> : <Redirect to='/' />} />
                  <Route path='/view/:email/:extra?' render={props => loggedIn ? <ViewEmail {...props} /> : <Redirect to='/' />} />
                  <Route component={Error} />
                </Switch>
              </Page>
            </Container>
          </div>
        </Provider>
      </SocketContext.Provider>
    );
  }
}

export default App;