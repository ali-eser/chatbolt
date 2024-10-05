import { useEffect, useRef, useState } from 'react'

import { questionsArray } from './data/questions'
import userService from './services/userService'
import './App.css'

const App = () => {
  const [answerBox, setAnswerBox] = useState('')
  const [answers, setAnswers] = useState([])
  const [chat, setChat] = useState([])
  const [user, setUser] = useState(null)

  const bottomRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newAnswer = e.target[0].value
    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)
    // put updated answers with user's sessionID to the database
    await userService.updateUserData(updatedAnswers, user.sessionId)
    // clear text input
    setAnswerBox('')
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await userService.getUserData()
        // Check if fetchedUser is valid
        if (fetchedUser && Object.keys(fetchedUser).length > 0) {
          setUser(fetchedUser)
          setAnswers(fetchedUser.answers)
        } else {
          // Only create a new user if fetchedUser is null or invalid
          const newUser = await userService.createNewUser()
          setUser(newUser)
        }
      } catch (err) {
        console.log(err)
      }
    };
    fetchUser()
  }, [])

  useEffect(() => {
    if (user && answers) {
      try {
        const updatedQuestions = questionsArray.slice(0, answers.length + 1);

        // map questions and answers
        const updatedChat = answers.map((a, i) => ({
          question: updatedQuestions[i],
          answer: a || ''
        }));

        // get the next unanswered question and push it into updatedChat
        if (answers.length < questionsArray.length) {
          updatedChat.push({
            question: updatedQuestions[answers.length],
            answer: ''
          });
        }

        // set chat state
        setChat(updatedChat);
      } catch (err) {
        console.log(err)
      }
    }
  }, [user, answers])

  // automatically scroll the chat screen to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  return (
    <div id='frame'>
      <div id='chatbox'>
        <section id='message-section'>
          {user && chat && (
            chat.map((item, index) => (
              <div id='chat' key={index}>
                <p className='message question'>{item.question}</p>
                {item.answer.length > 0 && (
                  <p className='message answer'>{item.answer}</p>
                )}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </section>
        <section id='input-section'>
          {answers.length < 10 && (
            <form onSubmit={handleSubmit}>
              <input type='text' name='answer' id='answer' 
                value={answerBox} onChange={(e) => setAnswerBox(e.target.value)} 
              />
              <button type='submit'>Send</button>
            </form>
          )}
          {answers.length > 9 && (
            <p id='thanks'>Thanks for answering all questions!</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default App

