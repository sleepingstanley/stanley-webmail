import React, { Component, } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, Dropdown, Menu } from 'semantic-ui-react';

import Auth from '../modules/auth';

class AppNavBar extends Component {
  render() {
    const { user } = this.props.auth;

    return (
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header name='home' as={Link} to='/'>
            stanley-webmail
          </Menu.Item>

          {Auth.isUserAuthenticated() ? (
            <Menu.Menu position='right'>
              <Dropdown item simple text={user.name}>
                <Dropdown.Menu>
                  <Dropdown.Item>Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to='/logout'>Log out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          ) : null}
        </Container>
      </Menu>
    );
  }
}

AppNavBar.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AppNavBar);