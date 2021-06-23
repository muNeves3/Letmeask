import copyImg from '../assets/images/copy.svg';
import '../styles/roomCode.scss'
import toast, { Toaster } from 'react-hot-toast';

interface IRoomCode {
    code: string;
}

export function RoomCode (props: IRoomCode) {
    function copyRoomCodeToClipboard () {
        navigator.clipboard.writeText(props.code);
        toast.success('Room code copied to clipboard');
    }

    return(
        <>
        <button className="room-code" onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copiar o código"/>
            </div>
            <span>Sala #{props.code}</span>
        </button>
        <Toaster />
        </>
    )
}