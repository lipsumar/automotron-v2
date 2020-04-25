import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import client from '../client';

class UserGeneratorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { generators: [] };
  }

  componentDidMount() {
    client
      .getGenerators(this.props.user._id)
      .then(generators => {
        this.setState({ generators });
      })
      .catch(err => {});
  }

  deleteGenerator(generatorId) {
    if (window.confirm('Are you sure ?')) {
      client.deleteGenerator(generatorId).then(() => {
        this.setState({
          generators: this.state.generators.filter(g => g._id !== generatorId),
        });
      });
    }
  }

  render() {
    return (
      <div className="grid">
        {this.state.generators.map(generator => {
          return (
            <Link
              to={`/editor/${generator._id}`}
              className="generator-card"
              key={generator._id}
            >
              <div
                className="generator-card__delete"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.deleteGenerator(generator._id);
                }}
              >
                <FiTrash2 />
              </div>
              <div className="generator-card__image">
                <img src={generator.preview} alt={generator.title} />
              </div>
              <div className="generator-card__title">{generator.title}</div>
            </Link>
          );
        })}
      </div>
    );
  }
}

export default UserGeneratorList;
