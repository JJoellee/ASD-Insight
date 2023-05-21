import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => (
  <footer>
    <Container>
      <Row className="justify-content-md-center py-3">
        <Col md="8" className="text-center">
          <p><strong>Data Source: </strong><a href="https://archive.ics.uci.edu/ml/datasets.php?format=&task=cla&att=&area=&numAtt=&numIns=&type=&sort=nameUp&view=table" target="_blank" rel="noopener noreferrer">ICU Machine Learning Repository</a> </p>
          <p><strong>AQ-10 Questions from: </strong><a href="https://www.autismresearchcentre.com/" target="_blank" rel="noopener noreferrer">Autism Research Center</a></p>
          <p>
            <strong>Disclaimer: This is a screening tool, not an official diagnostic
            tool. Always consult with a qualified healthcare professional for
            a proper diagnosis.</strong>
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
