import { Component } from '@angular/core'
import type { Difficulties, Question } from 'src/types'
import { OpenTriviaService } from '../services/open-trivia.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}

  public alertButtons = ['OK']

  displayError: boolean = false
  username?: string
  errorMsg: string | null = null
  rememberMe: boolean = false

  selectedDifficulty: Difficulties = 'easy'
  difficulties: Array<Difficulties> = ['easy', 'medium', 'hard']

  setErrorAlert(open: boolean) {
    this.displayError = open
  }

  startGame() {
    const length = this.username?.length || 0

    if (length < 3) {
      this.errorMsg = 'Le pseudonyme doit contenir au moins 3 caractères.'
      this.setErrorAlert(true)
      return
    }

    this.router.navigate(['/game'], {
      queryParams: { username: this.username, difficulty: this.selectedDifficulty },
    })
  }
}
