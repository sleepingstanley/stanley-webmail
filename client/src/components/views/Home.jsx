import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Header } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EmailList from '../EmailList';
import EmailModal from '../EmailModal';

class Home extends Component {
  componentDidMount() {
    document.title = 'stanley-webmail / home';
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div id='home'>
        <Header as='h1'>
          <span className='fa-layers fa-fw icon'>
            <FontAwesomeIcon icon='circle' transform='grow-6' />
            <FontAwesomeIcon inverse transform='shrink-6' icon='envelope' />
          </span>
          <Header.Content style={{paddingLeft: '15px'}}>
            {user.name || 'Loading'} - Inbox
            <Header.Subheader>
              {user.email || 'Loading'}
            </Header.Subheader>
          </Header.Content>
        </Header>
        <EmailModal />
        <EmailList />
      </div>
    );
  }
}

Home.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Home);