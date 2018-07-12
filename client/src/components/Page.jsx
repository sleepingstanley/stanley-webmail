import { Component } from 'react';

import Auth from '../modules/auth';
import { connect } from 'react-redux';
import { reauthenticateUser, deauthenticateUser } from '../actions/authActions';
import PropTypes from 'prop-types';

class Page extends Component {
  checkAuth() {
    if(Auth.isUserAuthenticated() && !this.props.auth.authenticated) {
      console.log('has auth token, no user. need to reauthenticate');
      //this.props.socket.emit('authenticate', 'needa reauth!');
      this.props.reauthenticateUser(this.props.socket).then(() => console.log('reauthenticated as', this.props.auth.user.name)).catch((err) => { this.props.deauthenticateUser() });
    }
  }

  componentDidMount() {
    this.checkAuth();
  }
  
  componentDidUpdate() {
    this.checkAuth();
  }

  render() {
    return this.props.children;
  }
}

Page.contextTypes = {
  router: PropTypes.object.isRequired,
};

Page.propTypes = {
  auth: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { reauthenticateUser, deauthenticateUser })(Page);