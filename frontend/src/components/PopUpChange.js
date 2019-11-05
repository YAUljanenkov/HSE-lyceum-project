import React from 'react';

class PopUp extends React.Component {
    render() {
        return (
        <div className="modal fade" id={`#modal-${this.props.group.id}`} tabIndex="-1" role="dialog"
             aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Редактирование группы</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="{{group['name']}}">Имя Вашей группы</label>
                                <input type="text" className="form-control" name="name"
                                       id="{{group['name']}}" aria-describedby="emailHelp"
                                       value="{{group['name']}}"/>
                                <small id="text-{{group['name']}}" className="form-text text-muted">Вы
                                    можете задать любое имя, оно не обязательно должно совпадать с
                                    реальным.</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="field-{{group['id']}}">id Вашей группы</label>
                                <input type="hidden" value="{{group['id']}}" name="group_id"/>
                                <input disabled type="number" className="form-control"
                                       id="field-{{group['id']}}" aria-describedby="emailHelp"
                                       value="{{group['id']}}"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputState">Выберите социальную сеть</label>

                                {this.props.group.type === 'VK' ?
                                    <select id="{{group['type']}}" className="form-control col-md-6"
                                            name="group_type">
                                        <option selected>VK</option>
                                        <option> Telegram </option>
                                        <option>Facebook</option>
                                    </select>:
                                    <select id="{{group['type']}}" className="form-control col-md-6"
                                            name="group_type">
                                        <option>VK</option>
                                        <option selected> Telegram </option>
                                        <option>Facebook</option>
                                    </select>
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                    data-dismiss="modal">Закрыть
                            </button>
                            <button className="btn btn-primary">Сохранить</button>
                        </div>
                </div>
            </div>
        </div>
        )
    }
}

export default PopUp;