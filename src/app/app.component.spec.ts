import { TestBed, ComponentFixture } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterOutlet } from '@angular/router'
import { CountdownStorage } from '../utils/localStorage'

// Mock the CountdownStorage utility to isolate the component test
jest.mock('../utils/localStorage', () => ({
  CountdownStorage: {
    get: jest.fn(() => ({ title: '', date: '' })),
    setTitle: jest.fn(),
    setDate: jest.fn(),
  },
}))

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>

  beforeEach(async () => {
    jest.useFakeTimers()
    jest.spyOn(global, 'setInterval') // Spy on setInterval
    jest.spyOn(global, 'clearInterval') // Spy on clearInterval
    localStorage.clear()

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet, CommonModule, ReactiveFormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance

    // Mock the screen.width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    })

    // Mock screen.orientation
    Object.defineProperty(window.screen, 'orientation', {
      writable: true,
      configurable: true,
      value: {
        type: 'portrait-primary',
        angle: 0,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    })

    fixture.detectChanges()
  })
  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('component | initialization | should create the component', () => {
    expect(component).toBeTruthy()
  })
  it('component | initialization | should have correct starting values', () => {
    expect(component.countDown).toBe('')
    expect(component.countdownDate).toBeNull()
    expect(component.displayedTitle).toBe('')
    expect(component.form.get('title')?.value).toBe('')
    expect(component.form.get('date')?.value).toBe('')
  })

  it('title | add title to input | title changes + localstorage updates', async () => {
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="title"]',
    )
    const displayDiv: HTMLElement = fixture.nativeElement.querySelector('#title')

    // Simulate user input
    const testText = 'Christmas morning'
    inputElement.value = testText
    inputElement.dispatchEvent(new Event('input'))

    // Wait for debounce to complete
    jest.advanceTimersByTime(500)
    fixture.detectChanges()

    // Check if the title has been updated
    expect(displayDiv.textContent).toBe(` Time to ${testText} `)
    expect(CountdownStorage.setTitle).toHaveBeenCalledWith(testText)
  })

  it('date | add date to input | countdown changes + localstorage updates', () => {
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="date"]',
    )
    const displayDiv: HTMLElement = fixture.nativeElement.querySelector('#countDown')

    // Simulate user input
    const twoDays30SecFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)
    const testText = twoDays30SecFromNow.toISOString().split('T')[0]
    inputElement.value = testText
    inputElement.dispatchEvent(new Event('input'))

    // Wait for debounce to complete
    jest.advanceTimersByTime(500)
    fixture.detectChanges()

    // Simulate one second for countdown calculation
    jest.advanceTimersByTime(1000)
    fixture.detectChanges()

    // Check if the countdown has been updated
    expect(displayDiv.textContent).toMatch(/^\d+ day(s)?, \d+h, \d+m, \d+s$/)
    expect(displayDiv.textContent).toContain('1 day, ')
    expect(CountdownStorage.setDate).toHaveBeenCalledWith(testText)
  })
  it('date | date is today | should display the celebration message', async () => {
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="date"]',
    )
    const displayDiv: HTMLElement = fixture.nativeElement.querySelector('#countDown')

    const today = new Date()
    const testText = today.toISOString().split('T')[0]
    inputElement.value = testText
    inputElement.dispatchEvent(new Event('input'))

    // Wait for debounce
    jest.advanceTimersByTime(500)
    fixture.detectChanges()

    // Simulate one second for countdown calculation
    jest.advanceTimersByTime(1000)
    fixture.detectChanges()

    expect(displayDiv.textContent).toBe("Ceeeeeelebrate good times, c'mon!! 🎉🥳🎶✨")
  })
  it('date | date is invalid | should display an error message', async () => {
    const dateInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="date"]',
    )
    const displayDiv: HTMLElement = fixture.nativeElement.querySelector('#countDown')

    // Simulate invalid date input
    const invalidDate = 'Invalid Date String'
    dateInput.value = invalidDate
    dateInput.dispatchEvent(new Event('input'))

    // Wait for debounce to complete
    jest.advanceTimersByTime(500) // Advance timer to simulate debounce
    fixture.detectChanges()

    // Check if the countdown message shows an error for invalid date
    expect(displayDiv.textContent).toContain('Invalid date❌🗓️🙃, you silly!😜')
    expect(CountdownStorage.setDate).not.toHaveBeenCalled() // Ensure that setDate was not called
  })
})
