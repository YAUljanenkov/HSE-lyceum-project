import React from 'react';
import {withRouter} from 'react-router-dom';
import PopUpAdd from "./PopUpAdd";
import PopUpChange from "./PopUpChange";
import authHeaders from "../utilites/authHeaders";
class Groups extends React.Component {
    state = {
        groups:[],
    };
    updateGroups = () => {
        fetch(`/groups?login=${this.props.login}`, {headers: authHeaders()}).then(response => response.json()).then(groups => this.setState({groups:groups}));
    };
    checkGroup = async (groupId) => {
        const formData = new FormData();
        formData.append("group_id", groupId);
        await fetch('/check', {
            method: 'POST',
            headers: authHeaders(),
            body: formData,
        });
        this.updateGroups();
    };
     deleteGroup = async (groupId) => {
         let auth = authHeaders();
         auth.append('Content-Type', 'application/json')
         console.log(auth);
        await fetch('/delete', {
            method: 'POST',
            headers: auth,
            body: JSON.stringify({'group_id': groupId}),
        });
        this.updateGroups();
    };
    componentDidMount() {
        this.props.setActiveRoute(this.props.location.pathname);
        this.updateGroups();

    }

    render() {
        return(
            <div className="container">
                <h1>Список групп</h1>
                {this.state.groups.map((group, index) =>
                    <div className="page" key={index}>
                        <span className="group-name">{group.name}</span>
                        {group.checked?
                            <span className="text-success">• Группа подтвреждена</span>:
                            <span className="text-warning">• Группа непроверена</span>
                        }
                        {group.checked?
                            <button type="button" className="btn btn-outline-primary" data-toggle="modal"
                                    data-target={`#modal-${group.id}`}>Редактировать
                            </button> :
                            <button onClick={() => this.checkGroup(group.id)} className="btn btn-outline-warning">Проверить</button>
                        }

                        <button onClick={() => this.deleteGroup(group.id)} className="btn btn-outline-danger">Удалить</button>
                        <PopUpChange group={group} login={this.props.login} refresh={this.updateGroups}/>
                    </div>

                )
                }
                {this.state.groups.length === 0?<p className="text-secondary">Вы не добавили ни одну группу.</p>:''}
                <div className="add" data-toggle="modal" data-target="#modal">+</div>
                <PopUpAdd refresh={this.updateGroups} login={this.props.login}/>
            </div>
        )

    }
}

export default withRouter(Groups);