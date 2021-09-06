import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import '../styles/room.scss';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import ansowerImg from '../assets/images/answer.svg';
import { Question } from '../components/Question';
import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';
import toast from 'react-hot-toast';
interface IRoomParams {
    id: string;
}

export function AdminRoom() {
    // const {user} = useAuth();
    const history = useHistory()
    const params = useParams<IRoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/');
    }

    function handleDeleteQuestionToast(questionId: string) {
        toast((t) => (
            <span>
              Tem certeza que deseja excluir essa pergunta?
              <button style={{marginLeft: 10, border: 'none', borderRadius: 8, backgroundColor: '#a690e8'}} onClick={() => handleDeleteQuestion(questionId)}>
                Excluir
              </button>

              <button style={{marginLeft: 10, border: 'none', borderRadius: 8, backgroundColor: '#d8d8d8'}} onClick={() => toast.dismiss(t.id)}>
                Cancelar
              </button>

              <button style={{marginLeft: 10, border: 'none', borderRadius: 8, backgroundColor: '#d8d8d8'}} onClick={() => toast.dismiss(t.id)}>
                Voltar
              </button>
            </span>
          ));
    }


    async function handleDeleteQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });
    }

    async function handleHightlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
    }

    

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask"/>
                    <div>
                        <RoomCode code={roomId}/> 
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>      
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title"> 
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && (
                        <span>{questions.length} perguntas</span>
                    )}
                </div>

               <div className="questionList">
               {questions.map(question => {
                        return(
                            <Question 
                                key={question.id} 
                                content={question.content} 
                                author={question.author}
                                isHighlighted={question.isHighlighted}
                                isAnswered={question.isAnswered}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                                >
                                                <img src={checkImg} alt="Marcar pergunta como respondida"/>
                                            </button>
                                        </div>

                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleHightlightQuestion(question.id)}
                                                >
                                                <img src={ansowerImg} alt="Dar destaque à pergunta"/>
                                            </button>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestionToast(question.id)}
                                        >
                                        <img src={deleteImg} alt="Remover pergunta"/>
                                    </button>
                                </div>
                            </Question>
                        )   
                    })}
               </div>
            </main>
        </div>
    );
}