import { Component, OnInit } from '@angular/core'
import type { Difficulties, Question } from 'src/types'
import { Preferences } from '@capacitor/preferences'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private router: Router) {}

  public alertButtons = ['OK']

  displayError: boolean = false
  username?: string
  errorMsg: string | null = null
  rememberMe: boolean = false
  preferencesLoaded: boolean = false

  selectedDifficulty: Difficulties = 'easy'
  difficulties: Array<Difficulties> = ['easy', 'medium', 'hard']

  async ngOnInit() {
    const { value: username } = await Preferences.get({ key: 'username' })
    this.username = username || ""

    const { value: difficulty } = await Preferences.get({ key: 'difficulty' })
    this.selectedDifficulty = (difficulty as Difficulties) || 'easy'
    
    this.rememberMe = username !== null && difficulty !== null
    this.preferencesLoaded = this.rememberMe
  }

  setErrorAlert(open: boolean) {
    this.displayError = open
  }

  async startGame() {
    if (!this.validateUsername()) {
      this.errorMsg = 'Le pseudonyme doit contenir au moins 3 caractères.'
      this.setErrorAlert(true)
      return
    }

    if (this.rememberMe) {
      console.info("remember :: save preferences")
      await this.savePreferences()
    } else if (this.preferencesLoaded) { // rememberMe is false here
      this.clearPreferences()
    }

    this.router.navigate(['/game'], {
      queryParams: { username: this.username, difficulty: this.selectedDifficulty },
    })
  }

  async savePreferences() {
    await Preferences.set({
      key: 'username',
      value: this.username || ''
    })

    await Preferences.set({
      key: 'difficulty',
      value: this.selectedDifficulty
    })
  }

  async clearPreferences() {
    await Preferences.clear()
  }

  validateUsername() {
    const length = this.username?.length || 0

    return length >= 3
  }
}
