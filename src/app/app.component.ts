import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { debounceTime } from 'rxjs/operators'
import { calculateTimeUntil } from '../utils/countdown'

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
    title: new FormControl('Summer'),
    date: new FormControl('2025-05-05'),
  })

  ngOnInit() {
    this.form
      .get('title')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(data => {
        console.log('New title:', data)
      })
    this.form
      .get('date')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe(data => {
        console.log('New date:', data)
      })

    const ONE_SEC = 1000
    this.timer = setInterval(() => {
      // Code to execute every 1000ms
      console.log('Interval function running')
      const date = this.form.get('date')?.value
      const today = new Date()
      if (date) {
        const endDate = new Date(date)
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
      }
    }, ONE_SEC)
  }
  ngOnDestroy() {
    // Clear the interval on component destroy
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
