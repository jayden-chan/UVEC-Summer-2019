import React, {Component} from 'react';
import Layout from '../components/Layout';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudDownload from '@material-ui/icons/CloudDownload';
import {Uploaded, Item, Staging} from './Upload';

import Button from '@material-ui/core/Button';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const download = require('downloadjs');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      download: '',
    };
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
        toast.success('File deleted');
        this.setState({
          files: this.state.files.filter(f => f !== file),
        });
      }
    });
  }

  renderFilesList() {
    if (this.state.files.length === 0) {
      return <div>You have no files</div>;
    } else {
      const items = this.state.files.map((file, idx) => {
        return (
          <Item key={file}>
            {file}
            <IconButton
              onClick={() => this.handleDownload(file)}
              variant="outlined"
              color="primary"
              size="small"
              style={{
                marginLeft: '1em',
                align: 'right',
              }}>
              <CloudDownload />
            </IconButton>
            <IconButton
              onClick={() => this.handleDelete(file, idx)}
              variant="outlined"
              color="secondary"
              style={{
                marginLeft: '1em',
              }}>
              <DeleteIcon />
            </IconButton>
          </Item>
        );
      });

      return <Uploaded>{items}</Uploaded>;
    }
  }

  render() {
    return (
      <Layout>
        <Staging>
          <h3>Uploaded Files</h3>
          {this.renderFilesList()}
        </Staging>
        <ToastContainer hideProgressBar autoClose={1500} />
      </Layout>
    );
  }
}
