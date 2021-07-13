import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import toast, { Toaster } from 'react-hot-toast';

import '../styles/auth.scss'
import { Button } from '../components/Button';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export function Home() {
    const history = useHistory();
    const { signInWithGoogle, user } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    const handleCreateRoom = async () => {
        if(!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if(roomCode.trim() === "") {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        
        if(!roomRef.exists()) {
            alert('Room does not exists ');
            return;
        }

        if(roomRef.val().endedAt) {
            toast.error('Room already closed');
            return
        }

        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustação representando perguntas e respostas"/>
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>tire as duvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="LetmeAsk"/>
                    <button className="create-room"  onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt=""/>
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                        <Toaster />
                    </form>
                </div>
            </main>
        </div>
    )
}