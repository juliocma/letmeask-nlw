import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { database } from '../services/firebase';
import { useAuth } from './useAuths';

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;
type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export function useRoom(roomID: string) {
  const { user } = useAuth();
  const history = useHistory();

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomID}`);

    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      if (databaseRoom?.closedAt) {
        alert('Room already closed');
        history.push('/');
        return;
      }
      const firebaseQuestions: FirebaseQuestions =
        databaseRoom?.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );

      setTitle(databaseRoom?.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      roomRef.off('value');
    };
  }, [roomID, user?.id]);

  return {
    questions,
    title,
  };
}
