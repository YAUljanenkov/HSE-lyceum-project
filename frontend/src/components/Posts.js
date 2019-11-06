import React from 'react';
import {withRouter} from 'react-router-dom';
import authHeaders from "../utilites/authHeaders";

class Posts extends React.Component {
    state = {
        posts:[],
        groups:['Загружается'],
    };
    componentDidMount() {
        this.props.setActiveRoute(this.props.location.pathname);

        this.updatePosts();
        fetch(`/groups?login=${this.props.login}`, {
            headers: authHeaders(),
            method: 'GET',
        }).then(response => response.json()).then((r) => {
            let groups = [];
            console.log(r);
            r.map((group) => group.checked?groups.push(group):null);
            this.setState({groups:groups});
        });

    }
    updatePosts = () => {
        fetch(`/posts?login=${this.props.login}`, {headers: authHeaders()})
            .then(response => response.json()).then(posts => {this.setState({posts:posts});
        console.log(posts);
        });
    };
    deletePost = (post_id) => {
        let auth = authHeaders();
        auth.append('Content-Type', 'application/json')
        fetch('/delete_post', {
            method: 'POST',
            headers: auth,
            body: JSON.stringify({'post_id': post_id}),
        }).then(() => this.updatePosts());

    };
    changePost = (id, e) => {
            let auth = authHeaders();
            e.preventDefault();
            let data = new FormData(document.getElementById(id));
            fetch('/change_post', {
                method: 'POST',
                headers: auth,
                body: data,
            });
    };
    render() {
        return(
            <div className="container">
                <h1>Список постов</h1>
                {this.state.posts.map((post, index) =>
                    <div>
                    <div className="page" key={index}>
                        <span className="group-name">{post.text.slice(0, 30)}</span>
                        <button data-toggle="modal"
                                data-target={`#modal-${post.id}`} className="btn btn-outline-primary">Изменить</button>
                        <button onClick={() => this.deletePost(post.id)} className="btn btn-outline-danger">Удалить</button>
                    </div>
                    <div  className="modal fade" id={`modal-${post.id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">Добавление группы</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <form id={`change-${post.id}`} onSubmit={(e) => this.changePost(`change-${post.id}`, e)}>
                    <div className="modal-body">
                            <h1> Редактировать пост</h1>
                            <textarea className="form-control col-md-8" rows="10" name="text" required={true}>
                                {post.text}
                            </textarea>
                            <input type="hidden" name="login" value={this.props.login}/>
                            <input type="hidden" name="post_id" value={post.id}/>
                            {/*<p className="font-weight-lighter">Выберите группы назначения</p>*/}
                            {/*<select name="groups" className="selectpicker" multiple required={true}>*/}
                            {/*    {this.state.groups.map((item, index) =>*/}
                            {/*        <option selected={!!post.groups.includes([item.id, item.name])}*/}
                            {/*                key={index} value={item.id}>{item.name}</option>)*/}
                            {/*    }*/}
                            {/*</select>*/}
                            <p className="font-weight-lighter">Изображения</p>
                            <input name="images" type="file" onChange={this.add_files_to_list} id="addImages" multiple={false}/>
                            <ul id="images-1" className="row">
                                {post.photos.map((index, photo) => <li className="photo-li col-md-4" key={`li-${index}`}>
                                    <img className="photo" id={index} src={index} alt=""/>
                                    <div onClick={() => this.remove_file_from_list(photo)}
                                         className="cross">&#10005;</div>
                                </li>)}
                            </ul>
                    </div>
                    <div className="modal-footer">
                    <button type="button" id="closeButton" className="btn btn-secondary" data-dismiss="modal">Закрыть
                    </button>
                    <button type="submit"  className="btn btn-primary">Сохранить</button>
                    </div>
                    </form>
                    </div>
                    </div>
                    </div>
                    </div>
                )}
            </div>)
    }
}

export default withRouter(Posts);