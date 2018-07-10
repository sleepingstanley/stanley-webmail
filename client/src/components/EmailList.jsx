import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Table, Checkbox, Menu, Dropdown, Popup, Dimmer, Loader } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faTrashAlt, faEnvelopeOpen, faTag, faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons'
import Moment from 'react-moment';

import { connect } from 'react-redux';
import { getEmails, deleteEmail, updateEmail } from '../actions/emailActions';
import PropTypes from 'prop-types';

class EmailList extends Component {
  state = {
    checkboxes: new Map()
  }

  componentDidMount() {
    this.props.getEmails();
  }

  onDeleteClick = () => {
    let tempCheckboxes = this.state.checkboxes;
    let emails = [];
    for (var [_id] of tempCheckboxes)
      emails.push(_id);
    this.props.deleteEmail(emails);
    tempCheckboxes.clear();
    this.setState({ checkboxes: tempCheckboxes });
  }

  onToggleReadClick = () => {
    let tempCheckboxes = this.state.checkboxes;
    let emails = [];
    for (var [_id, read] of tempCheckboxes) {
      emails.push({ _id: _id, data: { read: !read } });
      tempCheckboxes.set(_id, !read);
    }
    this.setState({ checkboxes: tempCheckboxes });
    this.props.updateEmail(emails);
  }

  toggleCheckbox = (id, read) => {
    let tempCheckboxes = this.state.checkboxes;
    if (tempCheckboxes.has(id)) {
      tempCheckboxes.delete(id);
    } else {
      tempCheckboxes.set(id, read);
    }
    this.setState({ checkboxes: tempCheckboxes });
  }

  render() {
    const { emails } = this.props.email;
    return (
      <div style={{ marginBottom: '10px' }}>
        {emails.length === 0 ? (
          <Dimmer active>
            <Loader content='Loading' />
          </Dimmer>
        ) : null}
        <Menu attached>
          <Popup trigger={
            <Menu.Item>
              <Checkbox />
            </Menu.Item>
          } content='Select all emails' position='bottom center' size='tiny' inverted />
          <Popup trigger={
            <Menu.Item icon className="borderless">
              <i className="icon"><FontAwesomeIcon icon={faArchive} /></i>
            </Menu.Item>
          } content='Archive' position='bottom center' size='tiny' inverted />
          <Popup trigger={
            <Menu.Item icon onClick={this.onDeleteClick}>
              <i className="icon"><FontAwesomeIcon icon={faTrashAlt} /></i>
            </Menu.Item>
          } content='Delete' position='bottom center' size='tiny' inverted />
          <Popup trigger={
            <Menu.Item icon onClick={this.onToggleReadClick} className="borderless">
              <i className="icon"><FontAwesomeIcon icon={faEnvelopeOpen} /></i>
            </Menu.Item>
          } content={this.state.checkboxes.size === 1 ? (this.state.checkboxes.values().next().value ? 'Mark as unread' : 'Mark as read') : 'Toggle read'} position='bottom center' size='tiny' inverted />
          <Popup trigger={
            <Menu.Item icon>
              <i className="icon"><FontAwesomeIcon icon={faTag} /></i>
            </Menu.Item>
          } content='Labels' position='bottom center' size='tiny' inverted />

          <Menu.Menu position='right'>
            <Dropdown item icon='ellipsis vertical'>
              <Dropdown.Menu>
                <Dropdown.Item>English</Dropdown.Item>
                <Dropdown.Item>Russian</Dropdown.Item>
                <Dropdown.Item>Spanish</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/*<Menu.Item>
              <Button primary>Sign Up</Button>
            </Menu.Item>*/}
          </Menu.Menu>
        </Menu>
        <Table basic selectable attached>
          <Table.Body>
            {emails.map(({ _id, from, subject, date, read, text }) => (
              <Table.Row key={_id} active={this.state.checkboxes.has(_id)} style={read ? {} : { fontWeight: 'bold' }}>
                <Table.Cell collapsing>
                  <Checkbox checked={this.state.checkboxes.has(_id)} onChange={this.toggleCheckbox.bind(this, _id, read)} />
                </Table.Cell>
                <Table.Cell collapsing>{from ? (from.name || from.email) : 'no sender'}</Table.Cell>
                <Table.Cell>
                  <Link to={`/view/${_id}`}>
                    {subject || 'no subject'} - <span style={{ fontWeight: '300' }}>{(text || 'no text preview available').substring(0, 75)}</span>
                  </Link>
                </Table.Cell>
                <Table.Cell collapsing textAlign='right'>
                  <Moment fromNow date={date} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='4'>
                <Menu floated='right' pagination>
                  <Menu.Item as='a' icon disabled>
                    <i className="icon"><FontAwesomeIcon icon={faChevronLeft} /></i>
                  </Menu.Item>
                  <Menu.Item disabled>1 - {emails.length} of {emails.length}</Menu.Item>
                  <Menu.Item as='a' icon disabled>
                    <i className="icon"><FontAwesomeIcon icon={faChevronRight} /></i>
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    );
  }
}

EmailList.propTypes = {
  getEmails: PropTypes.func.isRequired,
  updateEmail: PropTypes.func.isRequired,
  deleteEmail: PropTypes.func.isRequired,
  email: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  email: state.email
});

export default connect(mapStateToProps, {
  getEmails, deleteEmail, updateEmail
})(EmailList);