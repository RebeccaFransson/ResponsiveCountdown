/**
 * Purpose of this function is to change the font size of
 * a element to make the text fit the screen.
 * This is accomplised by checking if the width of the element
 * is bigger/smaller than the width of the screen (- some padding)
 * and then adding/subtracting from the frontsize,
 * until the text as close to the screens borders as possible
 * @param id string
 */
export const setFontSizeBasedOnScreenWidth = async (id: string) => {
  const element = document.getElementById(id)
  const containerElement = document.querySelector('main')

  const maxIterations = 500 // Set a limit for iterations to prevent infinite loop

  // Small delay to ensure the DOM has updated before starting
  await new Promise(resolve => setTimeout(resolve, 10))

  if (!element || element.textContent === '') return
  if (!containerElement) return
  const screenWidth = containerElement.clientWidth - 75 // Subtract padding

  let fontSize = element.style.fontSize ? parseFloat(element.style.fontSize) : 30

  // Function to adjust font size
  const adjustFontSize = (decrease: boolean) => {
    if (decrease) {
      fontSize--
    } else {
      fontSize++
    }
    element.style.fontSize = `${fontSize}px`
  }

  let iterations = 0

  while (iterations < maxIterations) {
    const overflow = screenWidth - element.scrollWidth

    if (overflow < -10) {
      adjustFontSize(true) // Decrease font size
    } else if (overflow > 10) {
      adjustFontSize(false) // Increase font size
    } else {
      break // Exit if within bounds
    }

    iterations++
  }

  if (iterations === maxIterations) {
    throw new Error(`Font size adjustment exceeded maximum iterations for element: ${id}`)
  }
}
