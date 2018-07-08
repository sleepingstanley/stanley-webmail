import React, { Component } from 'react';

import { Button, Form, Segment, Dropdown, Message } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/pro-light-svg-icons';

import { connect } from 'react-redux';
import { authenticateUser } from '../actions/authActions';
import PropTypes from 'prop-types';

const options = [
  { key: '@stanleykerr.co', text: '@stanleykerr.co', value: '@stanleykerr.co' },
  { key: '@tmp.stanleykerr.co', text: '@tmp.stanleykerr.co', value: '@tmp.stanleykerr.co' },
  { key: '@stanstown.com', text: '@stanstown.com', value: '@stanstown.com' },
];

class LoginForm extends Component {
  state = {
    username: '',
    domain: '@stanleykerr.co',
    password: ''
  }

  onChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  onSubmit = e => {
    e.preventDefault();
    const login = {
      email: this.state.username + this.state.domain,
      password: this.state.password
    };

    this.props.authenticateUser(login).then(() => this.context.router.history.push('/'));

    //this.setState({ to: undefined, from_email: undefined, from_name: undefined, subject: undefined, body: undefined });
    //this.toggle();
  }

  render() {
    const { errors } = this.props.auth;
    return (
      <Segment attached='top'>
        <Form size='large' onSubmit={this.onSubmit} error={errors.length !== 0} >

          <Message
            error
            header='Errors while signing in:'
            style={{ textAlign: 'left' }}
            list={errors}
          />
          <Form.Input onChange={this.onChange} fluid iconPosition='left' placeholder='E-mail address' name='username' action>
            <i className="icon"><FontAwesomeIcon icon={faUser} /></i>
            <input />
            <Dropdown onChange={this.onChange} button defaultValue='@stanleykerr.co' options={options} name='domain' />
          </Form.Input>
          <Form.Input onChange={this.onChange} fluid iconPosition='left' placeholder='Password' name='password' type='password'>
            <i className="icon"><FontAwesomeIcon icon={faLock} /></i>
            <input />
          </Form.Input>
          <Button color='blue' fluid size='large'>
            Login
          </Button>
        </Form>
      </Segment>
    );
  }
}

LoginForm.propTypes = {
  authenticateUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

LoginForm.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { authenticateUser })(LoginForm);