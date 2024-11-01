import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { debounceTime, map } from 'rxjs/operators'
import { calculateTimeUntil } from '../utils/countdown'
import { setFontSizeBasedOnLength } from '../utils/fontSize'
import { fromEvent, type Subscription } from 'rxjs'
import { CountdownStorage } from '../utils/localStorage'

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
    title: new FormControl(CountdownStorage.get()?.title),
    date: new FormControl(CountdownStorage.get()?.date),
  })
  displayedTitle = CountdownStorage.get()?.title ?? ''

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
      .subscribe(date => {
        if (date) {
          // Save date when it changes
          CountdownStorage.setDate(date)
        }
      })

    const ONE_SEC = 1000
    this.timer = setInterval(async () => {
      // Code to execute every 1000ms
      const date = this.form.get('date')?.value
      const today = new Date()
      if (date) {
        const endDate = new Date(date)
        if (!isNaN(endDate.getTime())) {
          if (
            today.getFullYear() === endDate.getFullYear() &&
            today.getMonth() === endDate.getMonth() &&
            today.getDate() === endDate.getDate()
          ) {
            this.countDown = 'Today is the daaaay!!'
          } else if (today > endDate) {
            this.countDown = 'This date has passed'
          } else {
            this.countDown = calculateTimeUntil(endDate)
          }
          setFontSizeBasedOnLength('countDown')
        } else {
          this.countDown = 'Invalid date, you silly.'
        }
      }
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
