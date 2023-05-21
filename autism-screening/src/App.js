import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Switch from "react-switch";
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import Footer from './Footer';

const ethnicityOptions = ['asian', 'black', 'hispanic', 'latino', 'middle eastern', 'others', 'pasifika', 'south asian', 'turkish', 'white-european'];
const countryOptions = ['afghanistan', 'albania', 'americansamoa', 'angola', 'anguilla', 'argentina', 'armenia', 'aruba', 'australia', 'austria', 'azerbaijan', 'bahamas', 'bahrain', 'bangladesh', 'belgium', 'bhutan', 'bolivia', 'brazil', 'bulgaria', 'burundi', 'canada', 'chile', 'china', 'comoros', 'costa rica', 'croatia', 'cyprus', 'czech republic', 'ecuador', 'egypt', 'ethiopia', 'europe', 'finland', 'france', 'georgia', 'germany', 'ghana', 'greenland', 'hong kong', 'iceland', 'india', 'indonesia', 'iran', 'iraq', 'ireland', 'isle of man', 'italy', 'japan', 'jordan', 'kazakhstan', 'kuwait', 'latvia', 'lebanon', 'libya', 'malaysia', 'malta', 'mexico', 'nepal', 'netherlands', 'new zealand', 'nicaragua', 'niger', 'nigeria', 'norway', 'oman', 'pakistan', 'philippines', 'portugal', 'qatar', 'romania', 'russia', 'saudi arabia', 'serbia', 'sierra leone', 'south africa', 'south korea', 'spain', 'sri lanka', 'sweden', 'syria', 'tonga', 'turkey', 'u.s. outlying islands', 'ukraine', 'united arab emirates', 'united kingdom', 'united states', 'uruguay', 'viet nam'];
const relationOptions = ['health care professional', 'others', 'parent', 'relative', 'self'];


const questions = {
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
    '10. I find it difficult to work out people’s intentions'],
    common: [
      { name: 'age', label: 'Age', type: 'number', min: 0 },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        options: ['Male', 'Female'],
      },
      {
        name: 'ethnicity',
        label: 'Ethnicity',
        type: 'select',
        options: ethnicityOptions,
      },
      {
        name: 'jaundice',
        label: 'Born with Jaundice',
        type: 'select',
        options: ['Yes', 'No'],
      },
      {
        name: 'autism',
        label: 'Family Member with PDD',
        type: 'select',
        options: ['Yes', 'No'],
      },
      {
        name: 'country_of_res',
        label: 'Country of Residence',
        type: 'select',
        options: countryOptions,
      },
      {
        name: 'relation',
        label: 'Who is completing the test',
        type: 'select',
        options: ['Parent', 'Self', 'Caregiver', 'Medical Staff', 'Clinician'],
      },   
      {
        name: 'used_app_before',
        label: 'Used the screening app before',
        type: 'select',
        options: ['Yes', 'No'],
      },
    ]
};

const defaultCommonAnswers = {
  age: 0,
  gender: 'Female',
  ethnicity: 'pasifica',
  jaundice: 'No',
  autism: 'No',
  relation: 'Self',
  country_of_res: 'lebanon',
  used_app_before: 'No',
};


const App = () => {

  const [ageGroup, setAgeGroup] = useState('child');
  const [ethnicity, setEthnicity] = useState('');
  const [country, setCountry] = useState('');
  const [relation, setRelation] = useState('');
  const [commonAnswers, setCommonAnswers] = useState(defaultCommonAnswers);
  const [specificAnswers, setSpecificAnswers] = useState(Array(questions[ageGroup].length).fill(0));
  const [result, setResult] = useState(null);

  useEffect(() => {
    setSpecificAnswers(Array(questions[ageGroup].length).fill(0));
  }, [ageGroup]);

  const handleCommonChange = (e) => {
    if (e.target.name === 'country_of_res') {
      setCountry(e.target.value);
    } else if (e.target.name === 'relation') {
      setRelation(e.target.value);
    } else if(e.target.name === 'ethnicity'){
      setEthnicity(e.target.value);
    } else {
      setCommonAnswers({
        ...commonAnswers,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSpecificChange = (checked, index) => {
    const newAnswers = [...specificAnswers];
    newAnswers[index] = checked ? 1 : 0;
    setSpecificAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...specificAnswers.reduce((obj, answer, i) => ({ ...obj, [`A${i+1}_Score`]: answer }), {}),
        ...commonAnswers,
        ...ethnicityOptions.reduce((obj, eth) => ({ ...obj, [`ethnicity_${eth}`]: ethnicity === eth ? 1 : 0 }), {}),
        ...countryOptions.reduce((obj, countryOption) => ({ ...obj, [`contry_of_res_${countryOption}`]: country === countryOption ? 1 : 0 }), {}),
        ...relationOptions.reduce((obj, relationOption) => ({ ...obj, [`relation_${relationOption}`]: relation === relationOption ? 1 : 0 }), {})
      };
      const response = await axios.post('http://localhost:5555/predict', dataToSend);
      if(response.data.prediction===0){
        setResult("Based on the information provided, a referral for an autism assessment may not be necessary. However, this tool should not replace professional medical advice. If you have concerns about autism, we strongly recommend speaking with a healthcare professional. Only a healthcare professional can provide a definitive diagnosis and advice.");
      }
      else{
        setResult("Based on the information provided, it might be beneficial to seek a professional assessment for autism. This tool is not a substitute for professional advice and cannot provide a definitive diagnosis. Please consult with a healthcare professional who can conduct a full evaluation and provide a more definitive guidance.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
    <Container className="mt-5">
    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
      <Card.Body>
        <Card.Title className="mb-4 text-center font-weight-bold" style={{ fontSize: '26px' }}>Autism Spectrum Quotient (AQ-10) Analysis Using Artificial Intelligence</Card.Title>


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
                    checked={specificAnswers[index] === 1}
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

          {result !== null && <p className="mt-3 text-center font-weight-bold">{result}</p>}
        </Form>
      </Card.Body>
    </Card>
  </Container>
<Footer/>
  </div>
  );
};

export default App;

