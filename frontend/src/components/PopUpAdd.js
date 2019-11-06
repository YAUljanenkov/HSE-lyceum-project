import React from 'react';
import authHeaders from "../utilites/authHeaders";
class PopUpAdd extends React.Component {
    componentDidMount() {
        let form = document.querySelector('#AddData');
        console.log(this.props.login);
        form.onsubmit = async (e) => {
            e.preventDefault();

            await fetch('/add', {
                headers: authHeaders(),
                method: 'POST',
                body: new FormData(form)
            });
            let btn = document.querySelector('#closeButton');
            btn.click();
            this.props.refresh();

        }
    }

    render() {
        return (
            <div className="modal fade" id="modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
                 aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Добавление группы</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form id="AddData">
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInput">Имя Вашей группы</label>
                                    <input type="hidden" name="login" value={this.props.login}/>
                                    <input type="text" className="form-control" name="name" id="exampleInput"
                                           aria-describedby="emailHelp" placeholder="Имя"/>
                                        <small id="email" className="form-text text-muted">Вы можете задать любое имя,
                                            оно не обязательно должно совпадать с реальным.</small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">id Вашей группы</label>
                                    <input type="number" className="form-control" name="group_id" id="exampleInputEmail1"
                                           aria-describedby="emailHelp" placeholder="Вставьте id"/>
                                        <small id="emailHelp" className="form-text text-muted">ID можно получить в
                                            адресной строке вашей публикации</small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputState">Выберите социальную сеть</label>
                                    <select id="inputState" className="form-control col-md-6" name="group_type">
                                        <option selected>VK</option>
                                        <option>Telegram</option>
                                        <option>Facebook</option>
                                    </select>
                                </div>
                                <p> Для VK и Facebook: После отправки id группы к вам добавится наш бот. Сделайте его
                                    администратором и нажмите на кнопку "Проверить".</p>
                                <p> Добавьте нашего бота @RozalyndBot в Вашу группу и сделайте его администратором,
                                    после чего нажмите на кнопку "Проверить".</p>
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
        )
    }
}
export default PopUpAdd;