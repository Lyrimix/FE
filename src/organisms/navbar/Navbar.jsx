import React from "react";
import { Navbar, Container, Row, Col } from "reactstrap";
import { UserOption } from "../../Molecules/Navbar-Mols/user-option/UserOption";
import { PROJECT_NAME } from "../../utils/constant";
import { ProjectInfo } from "../../Molecules/Navbar-Mols/project-info/ProjectInfo";
import "./Navbar.css";

export const NavbarComponent = () => {
  return (
    <Navbar color="light" light expand="md" className="custom-navbar">
      <Container fluid>
        <Row className="w-100 align-items-center">
          <Col md="6" className="d-flex justify-content-start">
            <ProjectInfo projectName={PROJECT_NAME} />
          </Col>
          <Col md="6" className="d-flex justify-content-end">
            <UserOption />
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};
