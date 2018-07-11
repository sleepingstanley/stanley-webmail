import React, { Component } from 'react';
import { Grid, Header, Label, Button, Popup } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class UserLabel extends Component {
  componentDidMount() {
  }

  render() {
    const { to } = this.props;
    const icon = to.me ? 'user' : to.realName ? 'user-lock' : 'user-slash';
    return (
      <Popup trigger={
        <Label color={to.realName ? 'blue' : null} style={{ cursor: 'pointer' }}>
            <i className='icon'><FontAwesomeIcon icon={icon} /></i>
            {(to.name || to.realName || to.email || 'no sender') + (to.me ? ' (me)' : '') /* TODO: Check to & from emails to see if they have account. If so, add realName & realID */}
        </Label>
        } on='click' position='bottom center' flowing>
        <Grid>
          <Grid.Column>
            <Header as='h3'>
              <span className='fa-layers fa-fw icon'>
                <FontAwesomeIcon icon='circle' transform='grow-8' color='black' />
                <FontAwesomeIcon inverse transform='shrink-6' icon={['fas', to.realName ? 'user' : 'user-slash']} />
              </span>
              <Header.Content>
              {(to.realName || to.name || to.email || 'No Sender') + (to.me ? ' (me)' : '')}
              {to.realName && to.name ? <Header.Subheader>{to.name}</Header.Subheader> : null}
              {to.realName || to.name ? <Header.Subheader>{to.email || 'No email address'}</Header.Subheader> : null}
              </Header.Content>
            </Header>
            {/*<p>
                TODO: Future status for registered friends? (or other details)
            </p>*/}
            {to.me ?
                <Button secondary disabled size='tiny' fluid icon labelPosition='left' style={{ marginTop: '10px' }}>
                <i className='icon'><FontAwesomeIcon icon='user-minus' /></i>
                Remove Friend
                </Button>
                : to.realName ?
                <Button color='green' size='tiny' fluid icon labelPosition='left' style={{ marginTop: '10px' }}>
                    <i className='icon'><FontAwesomeIcon icon='user-plus' /></i>
                    Add Friend
                </Button>
                :
                <Button primary size='tiny' fluid icon labelPosition='left' style={{ marginTop: '10px' }}>
                    <i className='icon'><FontAwesomeIcon icon='paper-plane' /></i>
                    Send Invite
                </Button>
            }
          </Grid.Column>
        </Grid>
      </Popup>
    );
  }
}

UserLabel.propTypes = {
  /*getEmail: PropTypes.func.isRequired,
  reauthenticateUser: PropTypes.func.isRequired,
  email: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired*/
}

export default UserLabel;