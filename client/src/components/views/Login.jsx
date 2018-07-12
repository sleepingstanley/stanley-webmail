import React, { Component } from 'react';

import { Grid, Header, Message } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';

import PropTypes from 'prop-types';

import LoginForm from '../LoginForm';

class Login extends Component {
  componentDidMount() {
    document.title = 'stanley-webmail / login';
    console.log(this.props);
  }

  render() {
    return (
      <div className='login-form'>
        <Grid textAlign='center'>
          <Grid.Column style={{ maxWidth: 600 }}>
            <Header as='h2' textAlign='center'>
              Log-in to your account
            </Header>
            <LoginForm />
            <Message negative attached='bottom' style={{ textAlign: 'left' }}>
              <i className="icon"><FontAwesomeIcon icon={faExclamationCircle} /></i>
              Account creation is currently disabled.
              {/*New to us? <Link to={{ page: '/' }}>Sign Up</Link>*/}
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

Login.contextTypes = {
  socket: PropTypes.object.isRequired
};

export default Login;