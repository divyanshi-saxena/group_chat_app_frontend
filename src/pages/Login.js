import React, { useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { useAuthDispatch } from '../context/auth'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const LOGIN_USER = gql`
  query login($username: String! $password: String!) {
    login(username: $username password: $password) {
      username
      token
      createdAt
    }
  }
`
export const Login = () => {
  const [variables, setVariables] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const authDispatch = useAuthDispatch()

  const [loginUser, { loading, data, error }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted: (data) => {
      // we are now setting data in context auth
      authDispatch({ type: 'LOGIN', payload: data.login })
      window.location.href = '/'
    }
  })

  const submitLoginForm = (event) => {
    event.preventDefault()
    console.log('Variables: ', variables)
    loginUser({ variables })
  }
  return (
    <Row className="bg-white rounded-3 py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={submitLoginForm}>

          <Form.Group className="mb-3">
            <Form.Label className={errors.username && 'text-danger'}>
              {errors.username ?? 'Username'}
            </Form.Label>
            <Form.Control type="text" placeholder="Enter user name"
              value={variables.username} className={errors.username && 'is-invalid'}
              onChange={e => setVariables({ ...variables, username: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className={errors.password && 'text-danger'}>
              {errors.password ?? 'Password'}
            </Form.Label>
            <Form.Control type="password" placeholder="Enter password"
              value={variables.password} className={errors.password && 'is-invalid'}
              onChange={e => setVariables({ ...variables, password: e.target.value })} />
          </Form.Group>

          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? 'loading..' : 'Login'}
            </Button>
            <br />
            <small>Don't have an account ? <Link to="/register">Register here</Link></small>
          </div>
        </Form>
      </Col>
    </Row>
  )
}
