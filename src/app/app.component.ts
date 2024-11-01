import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { debounceTime, map } from 'rxjs/operators'
import { calculateTimeUntil } from '../utils/countdown'
import { setFontSizeBasedOnLength } from '../utils/fontSize'
import { fromEvent, type Subscription } from 'rxjs'
import { CountdownStorage } from '../utils/localStorage'
import { isValidDate } from '../utils/validation'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  timer: any
  countDown = ''
  form = new FormGroup({
    title: new FormControl(CountdownStorage.get()?.title ?? ''),
    date: new FormControl(CountdownStorage.get()?.date ?? ''),
  })
  displayedTitle = CountdownStorage.get()?.title ?? ''
  countdownDate: Date | null = new Date(CountdownStorage.get()?.date ?? '')

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
          this.countDown = '👀'
          this.countdownDate = null
          return
        }
        // Validation on the string, save it as a date
        if (dateString && isValidDate(dateString) && !isNaN(new Date(dateString).getTime())) {
          // Save date when it changes
          CountdownStorage.setDate(dateString)
          this.countdownDate = new Date(dateString)
        } else {
          this.countDown = 'Invalid date❌🗓️, 🙃you silly!😜'
          this.countdownDate = null
          setFontSizeBasedOnLength('countDown')
        }
      })

    const ONE_SEC = 1000
    this.timer = setInterval(async () => {
      // Use saved Date-type to calculate countdown
      const date = this.countdownDate
      if (!date) return
      const today = new Date()
      const endDate = new Date(date)
      if (
        today.getFullYear() === endDate.getFullYear() &&
        today.getMonth() === endDate.getMonth() &&
        today.getDate() === endDate.getDate()
      ) {
        this.countDown = "Ceeeeeelebrate good times, c'mon!! 🎉🥳🎶✨"
      } else if (today > endDate) {
        this.countDown = 'Should probably pick a date in the future.. 🤔📅?'
      } else {
        this.countDown = calculateTimeUntil(endDate)
      }
      setFontSizeBasedOnLength('countDown')
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
