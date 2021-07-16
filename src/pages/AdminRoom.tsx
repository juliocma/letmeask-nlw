import { useParams, useHistory } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParams>();

  const roomID = params.id;
  const { title, questions } = useRoom(roomID);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomID}`).update({
      closedAt: new Date(),
    });
    history.push('/');
  }

  async function handleCheckQuestionAsAnswered(questionID: string) {
    await database.ref(`rooms/${roomID}/questions/${questionID}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionID: string) {
    await database.ref(`rooms/${roomID}/questions/${questionID}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionID: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomID}/questions/${questionID}`).remove();
    }
  }

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <img src={logoImg} alt='Logo' />
          <div>
            <RoomCode code={roomID} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className='question-list'>
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isHighlighted={question.isHighlighted}
                isAnswered={question.isAnswered}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type='button'
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt='Marcar Pergunta como respondida'
                      />
                    </button>

                    <button
                      type='button'
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt='Dar destaque a pergunta' />
                    </button>
                  </>
                )}
                <button
                  type='button'
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt='Remover Pergunta' />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
