import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Difficulties, Question, OpenTDBResponse } from 'src/types'

@Injectable({
  providedIn: 'root',
})
export class OpenTriviaService {
  baseUrl: string = 'https://opentdb.com/api.php'
  constructor(private http: HttpClient) {}

  async getQuestions(difficulty: Difficulties): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        amount: (10).toString(),
        difficulty
      })
      const url = `${this.baseUrl}?${params.toString()}`

      this.http.get(url).subscribe({
        next: (data) => {
          const questions = (data as OpenTDBResponse).results
          resolve(questions)
        },
        error: (err) => {
          console.error(err)
          reject([])
        },
      })
    })
  }

  shuffleAnswers(question: Question): Array<string> {
    const arrCopy = [...question.incorrect_answers, question.correct_answer]

    for (let i = arrCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = arrCopy[i]
      arrCopy[i] = arrCopy[j]
      arrCopy[j] = temp
    }

    return arrCopy
  }

  getToastResponse(correct: boolean, answer: string): string {
    let msg = `{0} réponse ! Vous avez choisi : ${answer}.`

    if (correct) {
      msg = msg.replace('{0}', 'Bonne')
    } else {
      msg = msg.replace('{0}', 'Mauvaise')
    }

    return msg
  }
}
