import { useState } from 'react'
import { useEffect } from 'react'
import userService from './services/userService'

import './App.css'
import { questionsArray } from './data/questions'

const App = () => {
  const [answerBox, setAnswerBox] = useState('')
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const user = await userService.getUserData()
      if (!user) {
        const user = await userService.createNewUser()
        console.log(user)
      }
      console.log(user.answers.length)
    }
    fetchUser()
  })

  return (
    <div id='frame'>
      <div id='chatbox'>
        <section id='message-section'>

        </section>
        <section id='input-section'>
          <form>
            <input type='text' name='answer' id='answer' 
              value={answerBox} onChange={(e) => setAnswerBox(e.target.value)} 
            />
            <button>Send</button>
          </form>
        </section>
      </div>
    </div>

  )
}

export default App
