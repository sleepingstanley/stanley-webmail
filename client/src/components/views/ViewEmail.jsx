import React, { Component } from 'react';

import { Grid, Header, Message } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';

//import LoginForm from '../LoginForm';

class ViewEmail extends Component {
  componentDidMount() {


    document.title = 'stanley-webmail / login';
  }

  render() {
    const { match: { params } } = this.props;
    return (
      <div className='login-form'>
        <Grid textAlign='center'>
          <Grid.Column style={{ maxWidth: 600 }}>
            <Header as='h2' textAlign='center'>
              Email: {params.email}
            </Header>
            xxx
            <Message negative attached='bottom' style={{ textAlign: 'left' }}>
              <i className="icon"><FontAwesomeIcon icon={faExclamationCircle} /></i>
              Account creation is currently disabled.
              {/*New to us? <Link to={{ page: '/' }}>Sign Up</Link>*/}
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default ViewEmail;