import { Component } from '@angular/core'
import type { Difficulties, Question } from 'src/types'
import { OpenTriviaService } from '../services/open-trivia.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private openTriviaSrv: OpenTriviaService) {}

  public alertButtons = ['OK']

  displayError: boolean = false
  isToastOpen: boolean = false
  connected: boolean = false
  username?: string
  errorMsg: string | null = null
  rememberMe: boolean = false

  selectedDifficulty: Difficulties = 'easy'
  difficulties: Array<Difficulties> = ['easy', 'medium', 'hard']
  points: number = 0

  questions: Array<Question> = []
  questionIndex: number = 0
  shuffled: Array<string> = []
  selectedAnswer: string | null = null

  toastMsg: string | null = null

  setToastOpen(open: boolean, message?: string) {
    this.isToastOpen = open
    this.toastMsg = message || null
  }
  setErrorAlert(open: boolean) {
    this.displayError = open
  }

  shuffleAnswers(question: Question) {
    this.shuffled = this.openTriviaSrv.shuffleAnswers(question)
  }

  async startGame() {
    const length = this.username?.length || 0

    if (length < 3) {
      this.errorMsg = 'Le pseudonyme doit contenir au moins 3 caractères.'
      this.setErrorAlert(true)
      return
    }
    
    this.connected = true
    await this.initGame()
  }

  async initGame() {
    this.points = 0
    this.questions = await this.openTriviaSrv.getQuestions(this.selectedDifficulty)
    this.questionIndex = 0
    if (this.questions.length > 0) {
      this.shuffleAnswers(this.questions[this.questionIndex])
    }
  }

  nextQuestion() {
    this.errorMsg = null
    this.selectedAnswer = null

    this.questionIndex++

    if (this.questionIndex < this.questions.length) {
      this.shuffleAnswers(this.questions[this.questionIndex])
      return
    }

    // Game ended
    const finalMsg = `Votre score est de ${this.points} points.`
    this.setToastOpen(true, finalMsg)
  }

  validateAnswer(answer: string) {
    if (this.selectedAnswer) return

    this.selectedAnswer = answer
    const currentQuestion = this.questions[this.questionIndex]
    let correctAnswer = false

    if (currentQuestion.correct_answer === answer) {
      correctAnswer = true
      this.points++
    }

    this.setToastOpen(true, this.openTriviaSrv.getToastResponse(correctAnswer, answer))
  }

  async replay() {
    await this.initGame()
  }

  reset() {
    this.connected = false
  }
}
