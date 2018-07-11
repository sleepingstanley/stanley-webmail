import React, { Component } from 'react';

import { Button, Form, Modal } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from 'react-redux';
import { sendEmail } from '../actions/emailActions';
import PropTypes from 'prop-types';

class EmailModal extends Component {
  state = {
    modalOpen: false
  }

  toggle = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  onChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  onSubmit = e => {
    e.preventDefault();

    const newEmail = {
      from: this.state.from_name && this.state.from_email ? `${this.state.from_name} <${this.state.from_email}>` : (this.state.from_name || this.state.from_email),
      spam_score: 0,
      SPF: 'pass',
      subject: this.state.subject,
      text: this.state.body,
      to: this.state.to
    };

    this.props.sendEmail(newEmail);

    this.setState({ to: undefined, from_email: undefined, from_name: undefined, subject: undefined, body: undefined });
    this.toggle();
  }

  render() {
    return (
      <Modal open={this.state.modalOpen} onClose={this.toggle} trigger={
        <Button icon labelPosition='left' color='red' style={{marginBottom: '10px'}} onClick={this.toggle}>
          <i className="icon"><FontAwesomeIcon icon='paper-plane' /></i>
          Compose Email
        </Button>
      }>
        <Modal.Header>New Email</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Input fluid onChange={this.onChange} name='to' label='To' placeholder='To' />
              <Form.Input fluid onChange={this.onChange} name='subject' label='Subject' placeholder='Subject' />
              <Form.TextArea onChange={this.onChange} name='body' label='Body' placeholder='' />
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary icon labelPosition='left' onClick={this.onSubmit}>
            <i className="icon"><FontAwesomeIcon icon='paper-plane' /></i>
            Send Email
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

EmailModal.propTypes = {
  sendEmail: PropTypes.func.isRequired,
  email: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  email: state.email
});

export default connect(mapStateToProps, { sendEmail })(EmailModal);