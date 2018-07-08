import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from '../store';

import 'semantic-ui-css/semantic.min.css';
import '../stylesheets/App.css';

import { Container } from 'semantic-ui-react';

import Auth from '../modules/auth';
import Home from './views/Home';
import Login from './views/Login';
import Logout from './views/Logout';
import Error from './views/Error';

import AppNavbar from './AppNavbar';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className='App'>
          <AppNavbar />
          <Container style={{ marginTop: '7em' }}>
            <Switch>
              <Route exact path='/' render={() => (
                Auth.isUserAuthenticated() ? <Home /> : <Redirect to='/login' />
              )} />
              <Route path='/login' render={() => (
                Auth.isUserAuthenticated() ? <Redirect to='/' /> : <Login />
              )} />
              <Route path='/logout' render={() => (
                Auth.isUserAuthenticated() ? <Logout /> : <Redirect to='/' />
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
