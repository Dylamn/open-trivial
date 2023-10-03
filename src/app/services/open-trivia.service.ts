import { Injectable } from '@angular/core'
import { Difficulties, Question } from 'src/types'

@Injectable({
  providedIn: 'root',
})
export class OpenTriviaService {
  constructor() {}

  async getQuestions(difficulty: Difficulties) {
    const questions = [
      {
        category: 'Entertainment: Japanese Anime & Manga',
        type: 'multiple',
        difficulty: 'easy',
        question: 'In "Fairy Tail", what is the nickname of Natsu Dragneel?',
        correct_answer: 'The Salamander',
        incorrect_answers: ['The Dragon Slayer', 'The Dragon', 'The Demon'],
      },
      {
        category: 'Entertainment: Video Games',
        type: 'boolean',
        difficulty: 'medium',
        question:
          '"Return to Castle Wolfenstein" was the only game of the Wolfenstein series where you don\'t play as William "B.J." Blazkowicz',
        correct_answer: 'False',
        incorrect_answers: ['True'],
      },
    ] as Array<Question>

    return questions
    // .filter(item => item.difficulty === difficulty)
  }

  shuffleAnswers(question: Question): Array<string> {
    const arrCopy = [...question.incorrect_answers, question.correct_answer]

    for (let i = arrCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arrCopy[i];
      arrCopy[i] = arrCopy[j];
      arrCopy[j] = temp;
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
