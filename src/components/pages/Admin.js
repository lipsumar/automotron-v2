import React from 'react';
import { Link } from 'react-router-dom';
import client from '../../client';
import PageLayout from '../PageLayout';

export default class Examples extends React.Component {
  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  componentDidMount() {
    client.getUsers().then(users => {
      this.setState({ users });
    });
  }

  render() {
    return (
      <PageLayout user={this.props.user}>
        <h2 className="page-heading">Admin</h2>
        {this.state.users.length > 0 ? (
          <ul className="list">
            {this.state.users.map(user => (
              <li>
                <Link to={`/editor/user/${user._id}`}>
                  {user.email || user.username}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>Loading...</div>
        )}
      </PageLayout>
    );
  }
}
