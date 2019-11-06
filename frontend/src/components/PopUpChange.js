import React from 'react';
import authHeaders from "../utilites/authHeaders";
class PopUpChange extends React.Component {

    componentDidMount() {
        let form = document.querySelector(`#changeData-${this.props.group.id}`);
        console.log(this.props.login);
        form.onsubmit = async (e) => {
            e.preventDefault();
            console.log('handle')
            await fetch('/change', {
                headers: authHeaders(),
                method: 'POST',
                body: new FormData(form)
            });
            let btn = document.querySelector(`#close-${this.props.group.id}`);
            btn.click();
            this.props.refresh();
        }
    }
    render() {
        return (
        <div className="modal fade" id={`modal-${this.props.group.id}`} tabIndex="-1" role="dialog"
             aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Редактирование группы</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form id={`changeData-${this.props.group.id}`}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="name">Имя Вашей группы</label>
                                <input type="hidden" name="login" value={this.props.login}/>
                                <input type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp"
                                       defaultValue={this.props.group.name}/>
                                <small id="text" className="form-text text-muted">Вы
                                    можете задать любое имя, оно не обязательно должно совпадать с
                                    реальным.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="field">id Вашей группы</label>
                                <input type="hidden" value={this.props.group.id} id="group_id" name="group_id"/>
                                <input disabled readOnly={true} type="number" className="form-control"
                                       id="field" aria-describedby="emailHelp"
                                       value={this.props.group.id}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputState">Выберите социальную сеть</label>

                                {this.props.group.type === 'VK' ?
                                    <select  className="form-control col-md-6"
                                            name="group_type">
                                        <option selected>VK</option>
                                        <option> Telegram </option>
                                        <option>Facebook</option>
                                    </select>:
                                    <select className="form-control col-md-6"
                                            name="group_type">
                                        <option>VK</option>
                                        <option selected> Telegram </option>
                                        <option>Facebook</option>
                                    </select>
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button id={`close-${this.props.group.id}`} type="button" className="btn btn-secondary"
                                    data-dismiss="modal">Закрыть
                            </button>
                            <button type="submit"  className="btn btn-primary">Сохранить</button>
                        </div>
                </form>
                </div>
            </div>
        </div>
        )
    }
}

export default PopUpChange;