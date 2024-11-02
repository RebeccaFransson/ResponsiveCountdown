import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { debounceTime } from 'rxjs/operators'
import { calculateTimeUntil } from '../utils/countdown'
import { setFontSizeBasedOnLength } from '../utils/fontSize'
import { fromEvent } from 'rxjs'
import { CountdownStorage } from '../utils/localStorage'
import { isValidDate } from '../utils/validation'
import { AvatarOnMouseMoveComponent } from './avatar-on-mouse-move/avatar-on-mouse-move.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, AvatarOnMouseMoveComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  timer: any
  countDown = ''
  private titleFromStorage = CountdownStorage.get()?.title ?? ''
  private dateFromStorage = CountdownStorage.get()?.date ?? ''
  form = new FormGroup({
    title: new FormControl(this.titleFromStorage),
    date: new FormControl(this.dateFromStorage),
  })
  displayedTitle = this.titleFromStorage
  countdownDate: Date | null = this.dateFromStorage ? new Date(this.dateFromStorage) : null

  ngOnInit() {
    setFontSizeBasedOnLength('title')
    this.form
      .get('title')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(title => {
        if (title) {
          setFontSizeBasedOnLength('title')
          CountdownStorage.setTitle(title)
        }
        this.displayedTitle = title ?? ''
      })

    this.form
      .get('date')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(dateString => {
        if (dateString === '') {
          this.countDown = ''
          this.countdownDate = null
          return
        }
        // Validation on the string, save it as a date
        if (dateString && isValidDate(dateString) && !isNaN(new Date(dateString).getTime())) {
          // Save date when it changes
          CountdownStorage.setDate(dateString)
          this.countdownDate = new Date(dateString)
        } else {
          this.countDown = 'Invalid date❌🗓️🙃, you silly!😜'
          this.countdownDate = null
          setFontSizeBasedOnLength('countDown')
        }
      })

    const ONE_SEC = 1000
    this.timer = setInterval(async () => {
      // Use saved Date-type to calculate countdown
      if (!this.countdownDate) return
      const today = new Date()
      const endDate = new Date(this.countdownDate)
      if (
        today.getFullYear() === endDate.getFullYear() &&
        today.getMonth() === endDate.getMonth() &&
        today.getDate() === endDate.getDate()
      ) {
        this.countDown = "Ceeeeeelebrate good times, c'mon!! 🎉🥳🎶✨"
      } else if (today > endDate) {
        this.countDown = 'You should probably pick a date in the future.. 🤔📅?'
      } else {
        this.countDown = calculateTimeUntil(endDate)
      }
      //setFontSizeBasedOnLength('countDown')
    }, ONE_SEC)

    fromEvent(window, 'resize').subscribe(() => {
      setFontSizeBasedOnLength('countDown')
      setFontSizeBasedOnLength('title')
    })
  }
  ngOnDestroy() {
    // Clear the interval on component destroy
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
