import React, { Component } from 'react';

import { Button, Form, Modal } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons'

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
      to: this.state.to,
      from: {
        email: this.state.from_email,
        name: this.state.from_name
      },
      subject: this.state.subject,
      body: this.state.body,
    };

    this.props.sendEmail(newEmail);

    this.setState({ to: undefined, from_email: undefined, from_name: undefined, subject: undefined, body: undefined });
    this.toggle();
  }

  render() {
    return (
      <div style={{ marginTop: '10px' }}>
        <Modal open={this.state.modalOpen} onClose={this.toggle} trigger={
          <Button icon labelPosition='right' onClick={this.toggle}>
            Send Email
            <i className="icon"><FontAwesomeIcon icon={faEnvelope} /></i>
          </Button>
        }>
          <Modal.Header>New Email</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form>
                <Form.Group widths='equal'>
                  <Form.Input fluid onChange={this.onChange} name='from_email' label='From email' placeholder='From email' />
                  <Form.Input fluid onChange={this.onChange} name='from_name' label='From name' placeholder='From name' />
                </Form.Group>
                <Form.Input fluid onChange={this.onChange} name='to' label='To' placeholder='To' />
                <Form.Input fluid onChange={this.onChange} name='subject' label='Subject' placeholder='Subject' />
                <Form.TextArea onChange={this.onChange} name='body' label='Body' placeholder='' />
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button primary icon labelPosition='right' onClick={this.onSubmit}>
              Send Email
              <i className="icon"><FontAwesomeIcon icon={faEnvelope} /></i>
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
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