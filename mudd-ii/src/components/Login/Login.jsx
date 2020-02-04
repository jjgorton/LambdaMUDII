import React, { useEffect, useContext } from 'react';
import { Form as FormikForm, Field, withFormik } from 'formik';
import * as Yup from 'yup';
import { Form } from 'semantic-ui-react'
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import UserContext from '../../contexts/UserContext';
import NavBarLogin from '../Nav/NavBarLogin'
import axios from 'axios'



const Login = (props) => {

    console.log(props)

    const { getUser } = useContext(UserContext);

    const { errors, touched, values, handleSubmit, status } = props;

    useEffect(() => {
        getUser(status)
    }, [status])
    
	return (
        <>
        <NavBarLogin {...props}/>
        <div className="login-panel">
        <div className="login-title">
        <h1>Login</h1>
        </div>
			<FormikForm use="semantic-ui-react" className="login-form">
                <div>
                <Form.Field>
				<Field className="login-input one" type="username" name="username" data-testid="username" placeholder="Username" />
                {touched.username && errors.username && <p className="error">{errors.username}</p>}
                </Form.Field>
                </div>
                <div>
                <Form.Field>
				<Field className="login-input" type="password" name="password" data-testid="password" placeholder="Password" />
				{touched.password && errors.password && <p className="error">{errors.password}</p>}
                </Form.Field>
                </div>

                <div>
				<button className="login-button" onClick={handleSubmit} type="submit">SUBMIT</button>
                </div>
			</FormikForm>
            
            
	
        </div>
        {/* <Footer /> */}
        </>
	);
};

const FormikLoginForm = withFormik({
	mapPropsToValues ({ username, password }) {
		return {
			username     : username || '',
			password : password || ''
		};
	},

	validationSchema : Yup.object().shape({
		username     : Yup.string().required('Please enter your username'),
		password : Yup.string().required('Please enter your password'),		
	}),

	handleSubmit (values, { props, setStatus, handleSubmit: e}) {
        // e.preventDefault()
        
        axios
			.post('https://team-miracle-deploy.herokuapp.com/api/login/', values)
			.then((res) => {
                console.log(res.data)
                localStorage.setItem('token', res.data.key);
                setStatus(res.data)
                const id = res.data.id
                props.history.push(`/games`)
			})
			.catch((err) => console.log(err.response));
    },
})(Login);

export default FormikLoginForm;





