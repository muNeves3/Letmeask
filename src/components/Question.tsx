import { ReactNode } from 'react';
import '../styles/question.scss';

interface IQuestionProps {
    content: string;
    author :{
        avatar: string;
        name: string;
    }
    children?: ReactNode;
    // isHighlighted: boolean;
    // isAnswered: boolean;
}

export function Question({content, author, children}: IQuestionProps) {
    return(
        <div className="question">
            <p>{content}</p>

            <footer>
                <div className="userInfo">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    )
}