import React from "react";
import { Toolbar, AppBar, Grid } from "@material-ui/core";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import App from "../pages/App";
import Login from "../pages/Login";
import Upload from "../pages/Upload";

export default function Header() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Grid item xs={6}>
          <h2>Guugle Drive</h2>
        </Grid>
        <Grid item xs={6}>
          <nav>
            <Link to="/">Home</Link>
            <Link to="login">Login</Link>
            <Link to="upload">Upload</Link>
          </nav>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
