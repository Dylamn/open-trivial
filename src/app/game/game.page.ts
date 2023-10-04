import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import type { Difficulties, Question } from 'src/types'
import { DataService } from '../services/data.service'
import { OpenTriviaService } from '../services/open-trivia.service'

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  // Route params
  username: string = ''
  selectedDifficulty: Difficulties = 'easy'

  // Game data
  points: number = 0
  questions: Array<Question> = []
  questionIndex: number = 0
  activeQuestion: Question | null = null
  shuffledAnswers: Array<string> = []
  selectedAnswer: string | null = null

  // Toast
  isToastOpen: boolean = false
  toastMsg: string | null = null

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private openTriviaSrv: OpenTriviaService,
    private dataSrv: DataService,
  ) {}

  ngOnInit() {
    this.username = this.activatedRoute.snapshot.queryParams['username']
    this.selectedDifficulty = this.activatedRoute.snapshot.queryParams['difficulty']
  }

  ionViewWillEnter() {
    this.init()
  }

  setToastOpen(newState: boolean, message?: string) {
    this.isToastOpen = newState
    this.toastMsg = message || null
  }

  shuffleAnswers(question: Question) {
    this.shuffledAnswers = this.openTriviaSrv.shuffleAnswers(question)
  }

  async init() {
    this.points = 0
    this.questionIndex = 0
    this.questions = await this.openTriviaSrv.getQuestions(this.selectedDifficulty)

    if (this.questions.length > 0) {
      this.shuffleAnswers(this.questions[this.questionIndex])
    }
  }

  getButtonColor(answer: string) {
    if (this.selectedAnswer === null) return 'medium'

    return this.questions[this.questionIndex].correct_answer === answer ? 'success' : 'danger'
  }

  validateAnswer(answer: string) {
    if (this.selectedAnswer) return // Answer already selected

    this.selectedAnswer = answer
    const currentQuestion = this.questions[this.questionIndex]
    let correctAnswer = false

    if (currentQuestion.correct_answer === answer) {
      correctAnswer = true
      this.points++
    }

    this.setToastOpen(true, this.openTriviaSrv.getToastResponse(correctAnswer, answer))
  }

  nextQuestion() {
    this.selectedAnswer = null
    this.questionIndex++

    if (this.questionIndex < this.questions.length) {
      this.shuffleAnswers(this.questions[this.questionIndex])
      this.activeQuestion = this.questions[this.questionIndex]
      return
    }

    // Game ended
    this.dataSrv.serviceData = this.points.toString()
    this.router.navigate(['/score'])
  }
}
