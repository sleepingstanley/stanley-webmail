import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Grid, Header, Message, Segment, Label, Dimmer, Loader, Breadcrumb, Divider, Button, Popup } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamation, faEnvelope, faFlag, faUser, faUserPlus, faUserCircle, faUserMinus, faPaperPlane } from '@fortawesome/pro-solid-svg-icons';

import { connect } from 'react-redux';
import { getEmail } from '../../actions/emailActions';
import { reauthenticateUser } from '../../actions/authActions';
import PropTypes from 'prop-types';

class ViewEmail extends Component {
  componentDidMount() {
    document.title = 'stanley-webmail / view email';
    if (Object.keys(this.props.auth.user).length === 0) {
      this.props.reauthenticateUser().catch(() => this.context.router.history.push('/'));
    }
    const { match: { params: { email } } } = this.props;
    this.props.getEmail(email);
  }

  render() {
    const { match: { params: { extra } } } = this.props;
    const bypass = extra && !extra.localeCompare('bypass');
    const { email: { email, loading } } = this.props;
    return (
      <div className='view-email'>
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
                    <div className='email'>
                      {email.spamFilter.pass ? null : bypass ?
                        <Message icon warning>
                          <i className='icon'><FontAwesomeIcon icon={faExclamationCircle} /></i>
                          <Message.Content>
                            <Message.Header>Message fully displayed</Message.Header>
                            Email has been flagged as spam, but you chose to display the full message anyways.<br />
                            <Button as={Link} to={`/view/${email._id}`} color='yellow' size="tiny" icon labelPosition='left' style={{ marginTop: '10px' }}>
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
                            <Button as={Link} to={`/view/${email._id}/bypass`} negative size='tiny' icon labelPosition='left' style={{ marginTop: '10px' }}>
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
                            From: {email.from && (email.from.name || email.from.email) ? (
                              <Popup trigger={
                                <Label style={{ cursor: 'pointer' }}>
                                  <i className='icon'><FontAwesomeIcon icon={faUser} /></i>
                                  {(email.from.name || email.from.realName || email.from.email) + (email.from.me ? ' (me)' : '')}
                                </Label>
                              } on='click' position='bottom center' flowing>
                                <Grid>
                                  <Grid.Column>
                                    <Header as='h3'>
                                      <i className='icon'><FontAwesomeIcon icon={faUserCircle} /></i>
                                      <Header.Content>
                                        {(email.from.realName || email.from.name || email.from.email) + (email.from.me ? ' (me)' : '')}
                                        {!email.from.realName && email.from.name ? <Header.Subheader>{email.from.name}</Header.Subheader> : null}
                                        {email.from.realName || email.from.name ? <Header.Subheader>{email.from.email}</Header.Subheader> : null}
                                      </Header.Content>
                                    </Header>
                                    {/*<p>
                                      TODO: Future status for registered friends? (or other details)
                                    </p>*/}

                                    {email.from.realName ?
                                      <Button color='green' size='tiny' fluid icon labelPosition='left' style={{ marginTop: '10px' }}>
                                        <i className='icon'><FontAwesomeIcon icon={faUserPlus} /></i>
                                        Add Friend
                                      </Button>
                                      :
                                      <Button primary size='tiny' fluid icon labelPosition='left' style={{ marginTop: '10px' }}>
                                        <i className='icon'><FontAwesomeIcon icon={faPaperPlane} /></i>
                                        Send Invite
                                      </Button>
                                    }
                                  </Grid.Column>
                                </Grid>
                              </Popup>
                            ) : 'No Sender'}
                          </Header.Subheader>
                          <Header.Subheader style={{ verticalAlign: 'middle !important', marginTop: '5px' }}>
                            To: {email.to.map(to => (
                              <Popup key={to._id} trigger={
                                <Label style={{ cursor: 'pointer' }}>
                                  <i className='icon'><FontAwesomeIcon icon={faUser} /></i>
                                  {(to.name || to.realName || to.email) + (to.me ? ' (me)' : '') /* TODO: Check to & from emails to see if they have account. If so, add realName & realID */}
                                </Label>
                              } on='click' position='bottom center' flowing>
                                <Grid>
                                  <Grid.Column>
                                    <Header as='h3'>
                                      <i className='icon'><FontAwesomeIcon icon={faUserCircle} /></i>
                                      <Header.Content>
                                        {(to.realName || to.name || to.email) + (to.me ? ' (me)' : '')}
                                        {!to.realName && to.name ? <Header.Subheader>{to.name}</Header.Subheader> : null}
                                        {to.realName || to.name ? <Header.Subheader>{to.email}</Header.Subheader> : null}
                                      </Header.Content>
                                    </Header>
                                    {/*<p>
                                      TODO: Future status for registered friends? (or other details)
                                    </p>*/}
                                    {to.me ?
                                      <Button secondary disabled size='tiny' fluid icon labelPosition='left' style={{ marginTop: '10px' }}>
                                        <i className='icon'><FontAwesomeIcon icon={faUserMinus} /></i>
                                        Remove Friend
                                      </Button>
                                      : to.realName ?
                                        <Button color='green' size='tiny' fluid icon labelPosition='left' style={{ marginTop: '10px' }}>
                                          <i className='icon'><FontAwesomeIcon icon={faUserPlus} /></i>
                                          Add Friend
                                      </Button>
                                        :
                                        <Button primary size='tiny' fluid icon labelPosition='left' style={{ marginTop: '10px' }}>
                                          <i className='icon'><FontAwesomeIcon icon={faPaperPlane} /></i>
                                          Send Invite
                                      </Button>
                                    }
                                  </Grid.Column>
                                </Grid>
                              </Popup>
                            ))}
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
                      <Segment attached dangerouslySetInnerHTML={{ __html: (((email.spamFilter.pass || bypass) && email.html) || email.text || 'No content available').replace(/(<? *script)/gi, 'illegalscript') }} />
                      <Message attached='bottom' negative>
                        <i className='icon'><FontAwesomeIcon icon={faExclamationCircle} /></i>
                        Email responses are currently disabled.
                      </Message>
                    </div>
                  )}
              </Grid.Column>
            </Grid>
          )}
      </div>
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