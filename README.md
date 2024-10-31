# Comments from the developer

Hi fellow developers! I'm looking forward to your feedback on this assignment for NC. I've not been
active in angular in a few years so I feel like I might have done some things that isn't best
practise, so please forgive me - I'm a react-girly! It was also impossible to the get design pixel
perfect without having the figma dev-tool. So I did my best with the data that I could get from the
figma sketch. I understand that the design here is not the purpose of this assignment, just wanted
to let you know anyway.

### More stuff I would like to add

- Reset button
- Add more validation
- Saving it to a user, which would require a login or (if this data isnt private) some kind of code
  and identifies the title/countdown
- Sharing it with other users/email addresses
- Share updates with the user when the countdown hits certain mile stones. Eg. 30days, 10days and so
  on.
- I would also definitly add some testing, both unit testing and the UI/end-to-end(which might be a
  bit of a overkill in this case).
- I would like to take another stab at the font-size-calculator. I'm not happy with the fact that
  there is a need for a 1ms timeout - but it was the only way to give some time to update the
  fontsize on the element before needing to check if it's the correct size.

# Description & requirements

Your objective in this assignment is to create a countdown app built using this boilerplate (+ any
other tools of your choice) that follows the design specifications provided
[in this Figma file](https://www.figma.com/file/UPEugUz5jM9IzIkWft2Y9m/NC-challenge). The app should
work in portrait as well as in landscape mode while the text displayed on the screen should always
fill the whole width of the screen.

In your app, it should be possible to define the end date and the name of the event taking place on
that day. The countdown should always start from the current time and it should display the time
remaining to your specified end date in the following format: Days, Hours(h), Minutes(m), Seconds(s)
_(e.g., 3 days, 15 h, 20 m, 5 s)_. To make sure the text always covers the entire screen width, it
should resize whenever necessary to achieve this objective.

The purpose of the solution is to “fit” the input text into an element in one line (no line breaks,
filling the whole width) using the maximum possible font-size.

Please make sure that your text fit solution is reusable and that the event name, as well as the
specified end date, are persisted between page reloads.

**Once you feel ready to share your solution, please:**

- Commit the code to Github or your favorite VCS.
- Write a simple README.md explaining how to set up the project (assuming it’s read by a developer
  who is experienced with all the used tools).
- Include a URL to a deployed working Web page (use netlify.com or github.io or whatever simple
  hosting tool that works for you).

Please put the resulting project in a public github repository and provide a link to it. Please make
it easy for us to test the result.

## Optional goals

You’re free to complete this additional goal to get a higher score if you want!

1. Write suggestions of how this solution can be improved. Describe what the next steps would be in
   order for this app to be production ready.

## Running the app

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will
automatically reload if you change any of the source files.

## Further help

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version
17.3.6.

To get more help on the Angular CLI use `ng help` or go check out the
[Angular CLI Overview and Command Reference](https://angular.io/cli) page.
