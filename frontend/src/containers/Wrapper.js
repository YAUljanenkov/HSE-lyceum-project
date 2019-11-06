import React from 'react';
import Post from "../components/Post";
import Groups from "../components/Groups";
import Posts from '../components/Posts';
import {connect} from "react-redux";
import {setActiveRoute} from "../actions/activeStateActions";
import '../App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class Wrapper extends React.Component {
  logout = () => {
    document.cookie = `token=0; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    window.location.reload();
  };
  render() {
    return(
        <Router>
          <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light nav-items-control">
              <Link className="navbar-brand" to="#">Posting bot</Link>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link className={this.props.active_route === '/new_post'? "nav-link active":"nav-link "}  to="/new_post">Новый пост</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={this.props.active_route === '/groups'? "nav-link active":"nav-link "} to="/groups">Группы</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={this.props.active_route === '/posts'? "nav-link active":"nav-link "} to="/posts">Опубликованные</Link>
                  </li>
                </ul>
              </div>
              <div className="logout-wrapper">
                <span className="username">{this.props.login}</span>
                <button type="button" className="btn btn-outline-danger" onClick={this.logout}>Выйти</button>
              </div>
            </nav>

            <Switch>
              <Route path="/groups">
                <Groups setActiveRoute={this.props.setActiveRoute} login={this.props.login}/>
              </Route>
              <Route path="/posts">
                <Posts setActiveRoute={this.props.setActiveRoute} login={this.props.login}/>
              </Route>
              <Route path="/new_post">
                <Post setActiveRoute={this.props.setActiveRoute} login={this.props.login}/>
              </Route>
            </Switch>
          </div>
        </Router>
    );
  }

}
const mapStateToProps = store => {
  console.log(store);
  return {
    active_route:store.active_route
  }
};
const mapDispatchToProps = dispatch => {
  return {
    setActiveRoute:route  => dispatch(setActiveRoute(route)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
