import React from 'react';
import {withRouter} from 'react-router-dom';
import authHeaders from "../utilites/authHeaders";

class Post extends React.Component {
    state = {
        photos:[],
        files:[],
        groups:['Загружается'],
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.state.groups);
    }

    componentDidMount() {
        this.props.setActiveRoute(this.props.location.pathname);
        fetch(`/groups?login=${this.props.login}`, {
            headers: authHeaders(),
            method: 'GET',
        }).then(response => response.json()).then((r) => {
            let groups = [];
            console.log(r);
            r.map((group) => group.checked?groups.push(group):null);
            this.setState({groups:groups});
        });
        document.getElementById('new_post_form').onsubmit = (e) => { e.preventDefault();
        this.send_files_on_server();
        }

    }
    send_files_on_server = () => {
        let data = new FormData(document.getElementById('new_post_form'));
        console.log(data.getAll('groups[]'));
        this.state.files.map((item) => {data.append('photo[]', item); console.log('added file')});
        console.log(data.getAll('photo[]'));
        fetch('/create_post', {
            headers: authHeaders(),
            method: 'POST',
            body: data
        }).then((res) => res.json()).then(r => r.result?this.clear_all(): this.setState({err:r.err}))
    };
    add_files_to_list = () =>  {
        let files = document.querySelector('input[type=file]').files;

        for(let i = 0; i < files.length; i++){
            let fs = Object.assign([], this.state.files);
            let file = files[i];
            fs.push(file);
            this.setState({files:fs});
            let reader = new FileReader();
            reader.onloadend = () => {
                let photos = Object.assign([], this.state.photos);
                photos.push(reader.result);
                this.setState({photos:photos})
            };
            reader.readAsDataURL(file);
        }
    };
    remove_file_from_list = (index) => {
        let fs = Object.assign([], this.state.files);
        delete fs[index];
        this.setState({files:fs});
        let photos = Object.assign([], this.state.photos);
        delete photos[index];
        this.setState({photos:photos})
    };
    clear_all = () => {
        this.setState({photos:[], files:[]})
        document.getElementById('new_post_form').reset();
    };
    render() {
        return(<div className="container">
            <form className="form-wrapper" id="new_post_form">
                <h1>Новый пост</h1>
                <textarea className="form-control col-md-8" rows="10" name="text" required={true}>
                </textarea>
                <input type="hidden" name="login" value={this.props.login}/>
                <p className="font-weight-lighter">Выберите группы назначения</p>
                    <select className="selectpicker" multiple name="groups[]" required={true}>
                        {this.state.groups.map((item, index) =>
                            <option key={index} value={item.id}>{item.name}</option>)
                        }
                    </select>
                <p className="font-weight-lighter">Выберите необходимые изображения</p>
                <input type="file" onChange={this.add_files_to_list} id="addImages" multiple={false}/>
                <ul id="images" className="row">
                    {this.state.photos.map((index, photo) => <li className="photo-li col-md-4" key={`li-${index}`}>
                        <img className="photo" id={index} src={index} alt=""/>
                        <div onClick={() => this.remove_file_from_list(photo)}
                             className="cross">&#10005;</div>
                    </li>)}
                </ul>
                <button className="btn btn-primary">Отправить</button>
            </form>
            {this.state.err? <div className="alert alert-danger" role="alert">{this.state.err}
            </div>:''}
        </div>)
    }
}

export default withRouter(Post);