import { Component } from 'react';

import { connect } from 'react-redux';
import { deauthenticateUser } from '../../actions/authActions';
import PropTypes from 'prop-types';

class Logout extends Component {
  componentDidMount() {
    document.title = 'stanley-webmail / logging out';
    this.props.deauthenticateUser().then(() => this.context.router.history.push('/'));
  }

  render() {
    return null;
  }
}

Logout.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deauthenticateUser })(Logout);