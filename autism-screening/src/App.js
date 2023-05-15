import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Switch from "react-switch";
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';


const questions = {
  common: [
      { name: 'age', label: 'Age', type: 'number', min: 0 },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        options: ['Male', 'Female'],
      },
      { name: 'ethnicity', label: 'Ethnicity', type: 'text' },
      {
        name: 'born_with_jaundice',
        label: 'Born with Jaundice',
        type: 'select',
        options: ['Yes', 'No'],
      },
      {
        name: 'family_member_with_pdd',
        label: 'Family Member with PDD',
        type: 'select',
        options: ['Yes', 'No'],
      },
      {
        name: 'completed_by',
        label: 'Who is completing the test',
        type: 'select',
        options: ['Parent', 'Self', 'Caregiver', 'Medical Staff', 'Clinician'],
      },
      { name: 'country_of_residence', label: 'Country of Residence', type: 'text' },
      {
        name: 'used_app_before',
        label: 'Used the screening app before',
        type: 'select',
        options: ['Yes', 'No'],
      },
    ],
    'child': ['1. S/he often notices small sounds when others do not',
    '2. S/he usually concentrates more on the whole picture, rather than the small details',
    '3. In a social group, s/he can easily keep track of several different people’s conversations',
    '4. S/he finds it easy to go back and forth between different activities',
    '5. S/he doesn’t know how to keep a conversation going with his/her peers',
    '6. S/he is good at social chit-chat ',
    '7. When s/he is read a story, s/he finds it difficult to work out the character’s intentions or feelings ',
    '8. When s/he was in preschool, s/he used to enjoy playing games involving pretending with other children', 
    '9. S/he finds it easy to work out what someone is thinking or feeling just by looking at their face ',
    '10. S/he finds it hard to make new friends'
    ],
    'adolescent': ['1. S/he notices patterns in things all the time ',
    '2. S/he usually concentrates more on the whole picture, rather than the small details',
    '3. In a social group, s/he can easily keep track of several different people’s conversations ',
    '4. If there is an interruption, s/he can switch back to what s/he was doing very quickly     ',
    '5. S/he frequently finds that s/he doesn’t know how to keep a conversation going ',
    '6. S/he is good at social chit-chat ',
    '7. When s/he was younger, s/he used to enjoy playing games involving pretending with other children ',
    '8. S/he finds it difficult to imagine what it would be like to be someone else ', 
    '9. S/he finds social situations easy',
    '10. S/he finds it hard to make new friends'],
    'adult': ['1. I often notice small sounds when others do not ',
    '2. I usually concentrate more on the whole picture, rather than the small details     ',
    '3. I find it easy to do more than one thing at once ',
    '4. If there is an interruption, I can switch back to what I was doing very quickly  ',
    '5. I find it easy to ‘read between the lines’ when someone is talking to me ',
    '6. I know how to tell if someone listening to me is getting bored',
    '7. When I’m reading a story I find it difficult to work out the characters’ intentions     ',
    '8. I like to collect information about categories of things (e.g. types of car, types of bird, types of train, types of plant etc) ', 
    '9. I find it easy to work out what someone is thinking or feeling just by looking at their face ',
    '10. I find it difficult to work out people’s intentions']
};




const App = () => {

  const [ageGroup, setAgeGroup] = useState('child');
  const [commonAnswers, setCommonAnswers] = useState({});
  const [specificAnswers, setSpecificAnswers] = useState(Array(questions[ageGroup].length).fill(''));
  const [result, setResult] = useState(null);

  const handleCommonChange = (e) => {
      setCommonAnswers({
          ...commonAnswers,
          [e.target.name]: e.target.value
      });
  };

const handleSpecificChange = (checked, index) => {
  const newAnswers = [...specificAnswers];
  newAnswers[index] = checked ? 'Yes' : 'No';
  setSpecificAnswers(newAnswers);
};

  

  const handleSubmit = async () => {
      try {
          const response = await axios.post('/predict', { ageGroup, commonAnswers, specificAnswers });
          setResult(response.data.prediction);
      } catch (error) {
          console.error(error);
      }
  };



  return (
    <Container className="mt-5">
    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
      <Card.Body>
        <Card.Title className="mb-4 text-center text-uppercase font-weight-bold">Autism Screening</Card.Title>


          <Form>
            <Form.Group as={Row} controlId="ageGroup" className="mb-3">
              <Form.Label column sm="3" className="font-weight-bold">
                Age Group
              </Form.Label>
              <Col sm="5">
                <Form.Control as="select" value={ageGroup} onChange={e => setAgeGroup(e.target.value)}>
                  <option value='child'>Child</option>
                  <option value='adolescent'>Adolescent</option>
                  <option value='adult'>Adult</option>
                </Form.Control>
              </Col>
            </Form.Group>
            {questions.common.map((question, index) => (
              <Form.Group as={Row} key={index} controlId={question.name} className="mb-3">
                <Form.Label column sm="3" className="font-weight-bold">
                  {question.label}
                </Form.Label>
                <Col sm="5">
                  {question.type === 'select' ? (
                    <Form.Control as="select" name={question.name} onChange={handleCommonChange}>
                      <option value="">Select...</option>
                      {question.options.map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Control>
                  ) : (
                    <Form.Control
                      type={question.type}
                      name={question.name}
                      onChange={handleCommonChange}
                      min={question.min}
                    />
                  )}
                </Col>
              </Form.Group>
            ))}
            <hr/>
            <h5 className="mb-3 font-weight-bold text-center">Specific Questions:</h5>
            {questions[ageGroup].map((question, index) => (
            <Form.Group key={index} controlId={`specificAnswer${index}`} className="mb-3">
              <Form.Label column sm="9">
                {question}
              </Form.Label>
              
                <Switch
                    onChange={(checked) => handleSpecificChange(checked, index)}
                    checked={specificAnswers[index] === 'Yes'}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    handleDiameter={15}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={15}
                    width={30}
                    className="react-switch"
                    id="material-switch"
                  />
            </Form.Group>
          ))}
          <div className="d-flex justify-content-center align-items-center">
  <Button variant="primary" type="button" onClick={handleSubmit} className="w-10">Submit</Button>
</div>

          {result !== null && <p className="mt-3 text-center font-weight-bold">Prediction: {result}</p>}
        </Form>
      </Card.Body>
    </Card>
  </Container>
  );
};

export default App;

