import React, {Component} from 'react';
import Layout from '../components/Layout';
import Button from '@material-ui/core/Button';

const download = require('downloadjs');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {files: [], download: ''};
    this.handleDownload = this.handleDownload.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount = async () => {
    if (!localStorage.getItem('guugle-login-token')) {
      this.props.history.push('/login');
      return;
    }

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

  handleDownload(file) {
    fetch(`http://localhost:3001/file/${file}`, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('guugle-login-token'),
      },
    }).then(res => {
      if (res.status !== 200) {
        res.text().then(text => alert(text));
      } else {
        res.blob().then(blob => {
          console.log(blob);
          download(blob, file);
        });
      }
    });
  }

  handleDelete(file, idx) {
    fetch(`http://localhost:3001/delete/${file}`, {
      method: 'DELETE',
      headers: {
        Authorization: localStorage.getItem('guugle-login-token'),
      },
    }).then(res => {
      if (res.status !== 200) {
        res.text().then(text => alert(text));
      } else {
        alert('File deleted');

        this.setState({
          files: this.state.files.filter(f => f !== file),
        });
      }
    });
  }

  render() {
    return (
      <Layout>
        <h2>Uploaded Files</h2>
        <ul>
          {this.state.files.map((file, idx) => {
            return (
              <li key={file}>
                {file}
                <Button
                  onClick={() => this.handleDownload(file)}
                  variant="contained"
                  color="primary">
                  Download
                </Button>
                <Button
                  onClick={() => this.handleDelete(file, idx)}
                  variant="contained"
                  color="primary">
                  Delete
                </Button>
              </li>
            );
          })}
        </ul>
      </Layout>
    );
  }
}
