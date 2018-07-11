import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Grid, Header, Message, Segment, Label, Dimmer, Loader, Breadcrumb, Divider, Button } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamation, faEnvelope, faFlag } from '@fortawesome/pro-solid-svg-icons';

import { connect } from 'react-redux';
import { getEmail } from '../../actions/emailActions';
import { reauthenticateUser } from '../../actions/authActions';
import PropTypes from 'prop-types';
import UserLabel from '../UserLabel';

class ViewEmail extends Component {
  componentDidMount() {
    if (Object.keys(this.props.auth.user).length === 0) {
      this.props.reauthenticateUser().catch(() => this.context.router.history.push('/'));
    }
    const { match: { params: { email } } } = this.props;
    this.props.getEmail(email);
    document.title = 'stanley-webmail / loading email';
  }

  componentDidUpdate() {
    const { match: { params: { extra } }, email: { email, loading } } = this.props;
    const bypass = extra && !extra.localeCompare('bypass');
    if(email === null || loading) {
      document.title = 'stanley-webmail / loading email';
    } else {
      document.title = 'stanley-webmail / view email - ' + (email.subject || 'No subject') + (bypass ? ' / bypass' : '');
    }
  }

  render() {
    const { match: { params: { extra } }, email: { email, loading } } = this.props;
    const bypass = extra && !extra.localeCompare('bypass');
    return (
      <React.Fragment>
        {email === null && loading ? (
          <Dimmer active>
            <Loader content='Loading' />
          </Dimmer>
        ) : (
            <Grid>
              <Grid.Column>
                <Breadcrumb>
                  <Breadcrumb.Section link as={Link} to='/'>Inbox</Breadcrumb.Section>
                  <Breadcrumb.Divider icon='right angle' />
                  <Breadcrumb.Section>View Email</Breadcrumb.Section>
                  <Breadcrumb.Divider icon='right angle' />
                  <Breadcrumb.Section active>{email === null ? 'Not Found' : email.subject || 'No Subject'}</Breadcrumb.Section>
                </Breadcrumb>
                <Divider />
                {email === null ? (
                  <Message icon negative>
                    <i className='icon'><FontAwesomeIcon icon={faExclamationCircle} /></i>
                    <Message.Content>
                      <Message.Header>We can't show you that email</Message.Header>
                      Email not found or the email ID is invalid
                    </Message.Content>
                  </Message>
                ) : (
                    <React.Fragment>
                      {email.spamFilter.pass ? null : bypass ?
                        <Message icon warning>
                          <i className='icon'><FontAwesomeIcon icon={faExclamationCircle} /></i>
                          <Message.Content>
                            <Message.Header>Message fully displayed</Message.Header>
                            Email has been flagged as spam, but you chose to display the full message anyways.<br />
                            <Button as={Link} to={`/view/${email._id}`} replace color='yellow' size="tiny" icon labelPosition='left' style={{ marginTop: '10px' }}>
                              <i className='icon'><FontAwesomeIcon icon={faExclamation} /></i>
                              Hide Content
                            </Button>
                          </Message.Content>
                        </Message>
                        :
                        <Message icon negative>
                          <i className='icon'><FontAwesomeIcon icon={faExclamationCircle} /></i>
                          <Message.Content>
                            <Message.Header>Message not fully displayed</Message.Header>
                            Email has been flagged as spam<br />
                            <Button as={Link} to={`/view/${email._id}/bypass`} replace negative size='tiny' icon labelPosition='left' style={{ marginTop: '10px' }}>
                              <i className='icon'><FontAwesomeIcon icon={faExclamation} /></i>
                              Show Content
                            </Button>
                          </Message.Content>
                        </Message>
                      }
                      {/*<Header as='h2'>
                        {email.subject} <Label color='blue' size='tiny'><i className='icon'><FontAwesomeIcon icon={faEnvelope} /></i>Inbox</Label>
                        {email.spamFilter.pass ? null : <Label color='red' size='tiny'><i className='icon'><FontAwesomeIcon icon={faFlag} /></i>Spam</Label>}
                    </Header>*/}
                      <Header attached='top' as='h2'>
                        <i className='icon'><FontAwesomeIcon icon={faEnvelope} /></i>
                        <Header.Content>
                          {email.subject || 'No Subject'} <Label color='blue' size='tiny'><i className='icon'><FontAwesomeIcon icon={faEnvelope} /></i>Inbox</Label>
                          {email.spamFilter.pass ? null : <Label color='red' size='tiny'><i className='icon'><FontAwesomeIcon icon={faFlag} /></i>Spam</Label>}
                          <Header.Subheader style={{ verticalAlign: 'middle !important', marginTop: '5px' }}>
                            {/* TODO: MAKE USER LABEL COMPONENT */}
                            From: <UserLabel to={email.from} />
                          </Header.Subheader>
                          <Header.Subheader style={{ verticalAlign: 'middle !important', marginTop: '5px' }}>
                            To: {email.to.map(to => (
                              <UserLabel key={to._id} to={to} />
                            ))}
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
                      <Segment attached dangerouslySetInnerHTML={{ __html: (((email.spamFilter.pass || bypass) && email.html) || email.text || 'No content available').replace(/(<? *script)/gi, 'illegalscript') }} />
                      <Message attached='bottom' negative>
                        <i className='icon'><FontAwesomeIcon icon={faExclamationCircle} /></i>
                        Email responses are currently disabled.
                      </Message>
                    </React.Fragment>
                  )}
              </Grid.Column>
            </Grid>
          )}
      </React.Fragment>
    );
  }
}

ViewEmail.propTypes = {
  getEmail: PropTypes.func.isRequired,
  reauthenticateUser: PropTypes.func.isRequired,
  email: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  email: state.email,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getEmail, reauthenticateUser
})(ViewEmail);