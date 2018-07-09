import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Header } from 'semantic-ui-react';

import { reauthenticateUser } from '../../actions/authActions';

import EmailList from '../EmailList';
import EmailModal from '../EmailModal';

class Home extends Component {
  componentDidMount() {
    document.title = 'stanley-webmail / home';
    if (Object.keys(this.props.auth.user).length === 0) {
      this.props.reauthenticateUser().catch(() => this.context.router.history.push('/'));
    }
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div id='home'>
        <Header as='h1'>{user.name} - {user.email}</Header>
        <EmailList />
        <EmailModal />
      </div>
    );
  }
}

Home.propTypes = {
  reauthenticateUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

Home.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { reauthenticateUser })(Home);