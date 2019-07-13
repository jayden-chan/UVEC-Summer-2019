import React from "react";
import { Box, Grid } from "@material-ui/core";
import styled from "styled-components";

const LayoutDiv = styled.div`
  margin-top: 5em;
`;

export default function Layout(props) {
  return <LayoutDiv>{props.children}</LayoutDiv>;
}
