import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const REGISTER_USER = gql`
  mutation register($username: String! $email: String! $password: String! $confirmPassword: String!){
    register(username: $username email: $email password: $password confirmPassword: $confirmPassword){
      username createdAt
    }
  }
`;
export const Register = (props) => {

  const [variables, setVariables] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})

  const [registerUser, { loading, data, error }] = useMutation(REGISTER_USER, {

    // Redirect to login page when registered
    update: (cache, res) => props.history.push('/login'),
    // Handle error
    onError: (err) => {
      // console.log('errors - seterrors : ', errors)
      // console.log('ERROR : ', error)
      // console.log('DATA : ', data)
      // console.log('onerror: ', err)
      // console.log('object: ', err.networkError.result.errors)
      // console.log('json: ', JSON.stringify(err))
      // console.log('err ', err)
      console.log('err: ', err.graphQLErrors[0].extensions.errors)
      setErrors(err.graphQLErrors[0].extensions.errors)
    }
  })

  const submitRegistrationForm = (event) => {
    event.preventDefault()
    console.log('variables: ', variables)
    registerUser({ variables })
  }

  return (
    <Row className="bg-white rounded-3 py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        
        {/* HEADING */}
        <h1 className="text-center">REGISTER</h1>

        {/* FORM STARTS */}
        <Form onSubmit={submitRegistrationForm}>
          
          <Form.Group className="mb-3">
            <Form.Label className={errors.email && 'text-danger'}>
              {errors.email ?? 'Email address'}
            </Form.Label>
            <Form.Control type="email"
              value={variables.email} className={errors.email && 'is-invalid'}
              onChange={e => setVariables({ ...variables, email: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className={errors.username && 'text-danger'}>
              {errors.username ?? 'Username'}
            </Form.Label>
            <Form.Control type="text"
              value={variables.username} className={errors.username && 'is-invalid'}
              onChange={e => setVariables({ ...variables, username: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className={errors.password && 'text-danger'}>
              {errors.password ?? 'Password'}
            </Form.Label>
            <Form.Control type="password"
              value={variables.password} className={errors.password && 'is-invalid'}
              onChange={e => setVariables({ ...variables, password: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className={errors.confirmPassword && 'text-danger'}>
              {errors.confirmPassword ?? 'Confirm Password'}
            </Form.Label>
            <Form.Control type="password"
              value={variables.confirmPassword} className={errors.confirmPassword && 'is-invalid'}
              onChange={e => setVariables({ ...variables, confirmPassword: e.target.value })} />
          </Form.Group>
  
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? 'loading..' : 'Register'}
            </Button>
            <br />
            <small>Already have an account ? <Link to="/login">Login</Link></small>
          </div>

        </Form>
        {/* FORM ENDS */}

      </Col>
    </Row>
  )
}
