import React from 'react';
import { Base64 } from 'js-base64';
import getCookie from "../utilites/cookies";

class Login extends React.Component {
    state = {
        result: null,
        err: ''
    };
    componentDidMount() {
        let form = document.querySelector("#RegisterForm");
        form.onsubmit = async (e) => {
            e.preventDefault();
            let login = document.getElementById('exampleInput2').value;
            let password = document.getElementById('exampleInputPassword1').value;
            let response = await fetch('/login', {
                method: 'POST',
                body: new FormData(form)
            });
            let res = await response.json();
            this.setState({result: res.result, err:res.err});
            console.log(res.err, res.result);
            if(res.result === Number(1)) {
                let headers = new Headers();
                headers.append('Authorization', 'Basic ' + Base64.encode(login + ":" + password));
                fetch('get_token', {
                    method: 'GET',
                    headers: headers,
                }).then(res => res.json()).then(r => {
                    document.cookie = `token=${r.token}; expires=3000`
                }).then(() => {
                    while(!getCookie('token')) {}
                    this.props.refresh(login);
                });
            }
        }
    }
    render() {
        return(
            <div className="col-md-6">
                <form id="RegisterForm">
                    <div className="form-group">
                        <label htmlFor="exampleInput2">Введите ваш логин</label>
                        <input type="text" className="form-control" id="exampleInput2"
                               aria-describedby="emailHelp" name="login" placeholder="ваш логин"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Пароль</label>
                        <input type="password" name="password" className="form-control" id="exampleInputPassword1"
                               placeholder="Пароль"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                {this.state.err? <div className="alert alert-danger" role="alert">{this.state.err}
                </div>:''}
            </div>
        )
    }
}

export default Login;