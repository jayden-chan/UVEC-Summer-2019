import React, {Component} from 'react';
import Layout from '../components/Layout';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {files: []};
  }

  componentDidMount = async () => {
    const link = 'http://localhost:3001/list';
    fetch(link, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('guugle-login-token'),
      },
    }).then(res => {
      if (res.status === 200) {
        res.json().then(json => this.setState({files: json}));
      } else {
        res.text().then(text => alert(text));
      }
    });
  };

  render() {
    return (
      <Layout>
        <h2>Uploaded Files</h2>
        <ul>
          {this.state.files.map(f => {
            return <li key={f}>{f}</li>;
          })}
        </ul>
      </Layout>
    );
  }
}
