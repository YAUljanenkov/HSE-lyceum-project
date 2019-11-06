import React from 'react'
import Wrapper from "./containers/Wrapper";
import Register from './components/Register'
import getCookie from "./utilites/cookies";
import Login from "./components/Login";

class App extends React.Component {
    componentDidMount() {
        if (getCookie('token')) {
            this.setState({is_authorized:true});
        }
        else {
            this.setState({is_authorized:false});
        }
        if(getCookie('login')) {
            this.setState({login: getCookie('login')})
        }
    }
    state = {
        is_authorized:false,
        login_active: true,
        login:null,
    };
    refresh = (login) => {
        if (getCookie('token')) {
            this.setState({is_authorized:true, login:login});
            window.location.href = '/new_post';
        }
        else {
            this.setState({is_authorized:false});
        }
        if(login)  {
            document.cookie = `login=${login}; expires=3000`

        }
        window.location.reload();

    };
    render() {
        return (
            <div>
                {this.state.is_authorized? <Wrapper login={this.state.login}/>:
                    <div className="container form-wrapper">
                        <h1>Войдите на сайт</h1>
                        <div className="row">
                            <div onClick={() =>this.setState({login_active: true})}
                                 className={this.state.login_active?"col-md-4 active-button":
                                "col-md-4 inactive-button"}>
                                <h5>Вход</h5>
                            </div>
                            <div onClick={() =>this.setState({login_active: false})}
                                 className={this.state.login_active?"col-md-8 inactive-button":
                                "col-md-8 active-button"}>
                                <h5>Регистрация</h5>
                            </div>
                        </div>
                        {this.state.login_active ? <Login  refresh={this.refresh}/> :
                            <Register refresh={this.refresh}/>
                        }
                    </div> }
            </div>
        )

    }
}
export default App;