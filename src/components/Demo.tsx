import React, { ReactNode } from "react";
import styled, { AnyStyledComponent } from "styled-components";

class Demo extends React.PureComponent {
  render = (): ReactNode => {
    return <StyledSpan>Welcome to React Typescript Boilerplate</StyledSpan>;
  };
}

const StyledSpan: AnyStyledComponent = styled.span`
  margin: 1rem;
`;

export default Demo;
