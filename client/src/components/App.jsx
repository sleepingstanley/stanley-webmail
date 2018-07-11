import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from '../store';

import 'semantic-ui-css/semantic.min.css';
import '../stylesheets/App.css';

import { Container } from 'semantic-ui-react';

import Auth from '../modules/auth';
import '../modules/client';

import Home from './views/Home';
import Login from './views/Login';
import Logout from './views/Logout';
import ViewEmail from './views/ViewEmail';
import Error from './views/Error';

import AppNavbar from './AppNavbar';

import { library } from '@fortawesome/fontawesome-svg-core'
//import { fab } from '@fortawesome/free-brands-svg-icons'
import { fal } from '@fortawesome/pro-light-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
//import { far } from '@fortawesome/pro-regular-svg-icons';

library.add(/*fab, */fas, fal/*, far*/);


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className='App'>
          <AppNavbar />
          <Container style={{ marginTop: '7em' }}>
            <Switch>
              <Route exact path='/' render={props => (
                Auth.isUserAuthenticated() ? <Home {...props} /> : <Redirect to='/login' />
              )} />
              <Route path='/login' render={props => (
                Auth.isUserAuthenticated() ? <Redirect to='/' /> : <Login {...props} />
              )} />
              <Route path='/logout' render={props => (
                Auth.isUserAuthenticated() ? <Logout {...props} /> : <Redirect to='/' />
              )} />
              <Route path='/view/:email/:extra?' render={props => (
                Auth.isUserAuthenticated() ? <ViewEmail {...props} /> : <Redirect to='/' />
              )} />
              <Route component={Error} />
            </Switch>
          </Container>
        </div>
      </Provider>
    );
  }
}

/*
<div className="App">
  <AppNavbar />
  <Container style={{ marginTop: '7em' }}>
    <Header as='h1'>Semantic UI React Fixed Template</Header>
    <EmailList />
    <EmailModal />
  </Container>
</div>
*/

export default App;
