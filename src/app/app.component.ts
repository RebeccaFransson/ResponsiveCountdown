import { Component } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { debounceTime, throttleTime } from 'rxjs/operators'
import { calculateTimeUntil } from '../utils/countdown'
import { setFontSizeBasedOnScreenWidth } from '../utils/fontSize'
import { fromEvent, type Subscription } from 'rxjs'
import { CountdownStorage, type CountdownData } from '../utils/localStorage'
import { isValidDate } from '../utils/validation'
import { AvatarOnMouseMoveComponent } from './avatar-on-mouse-move/avatar-on-mouse-move.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvatarOnMouseMoveComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private storage: CountdownData | null = CountdownStorage.get()
  private dateFromStorage: string = this.storage?.date ?? ''
  private titleFromStorage: string = this.storage?.title ?? ''
  private titleSubscr: Subscription | undefined = undefined
  private dateSubscr: Subscription | undefined = undefined

  public timer: NodeJS.Timeout | null = null
  public countDown: string = ''
  public form: FormGroup = new FormGroup({
    title: new FormControl(this.titleFromStorage),
    date: new FormControl(this.dateFromStorage),
  })
  public displayedTitle: string = this.titleFromStorage
  public countdownDate: Date | null = this.dateFromStorage ? new Date(this.dateFromStorage) : null

  ngOnInit() {
    setFontSizeBasedOnScreenWidth('title')
    this.titleSubscr = this.form
      .get('title')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(title => {
        if (title) {
          setFontSizeBasedOnScreenWidth('title')
          CountdownStorage.setTitle(title)
        }
        this.displayedTitle = title ?? ''
      })

    this.dateSubscr = this.form
      .get('date')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(dateString => {
        if (dateString === '') {
          this.countDown = ''
          this.countdownDate = null
          return
        }
        // Validation on the string and save the string to storage
        if (dateString && isValidDate(dateString) && !isNaN(new Date(dateString).getTime())) {
          CountdownStorage.setDate(dateString)
          this.countdownDate = new Date(dateString)
        } else {
          this.countDown = 'Invalid date❌🗓️🙃, you silly!😜'
          this.countdownDate = null
          setFontSizeBasedOnScreenWidth('countDown')
        }
      })

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
      setFontSizeBasedOnScreenWidth('countDown')
    }, 1000)

    fromEvent(window, 'resize')
      .pipe(throttleTime(500))
      .subscribe(() => {
        setFontSizeBasedOnScreenWidth('countDown')
        setFontSizeBasedOnScreenWidth('title')
      })
  }
  ngOnDestroy() {
    // Clear the interval on component destroy
    if (this.timer) {
      clearInterval(this.timer)
    }
    // Clean up subscriptions
    this.titleSubscr?.unsubscribe()
    this.dateSubscr?.unsubscribe()
  }
}
