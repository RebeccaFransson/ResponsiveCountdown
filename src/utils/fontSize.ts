/**
 * Purpose of this function is to change the font size of
 * a element to make the text fit the screen.
 * This is accomplised by checking if the width of the element
 * is bigger/smaller than the width of the screen (- some padding)
 * and then adding/subtracting from the frontsize,
 * until the text as close to the screens borders as possible
 * @param id string
 */
export const setFontSizeBasedOnLength = async (id: string) => {
  const screenWidth = window.outerWidth - 75 // subtract padding

  // Needed a timeout here too otherwise the element.scrollWidth would not be correct to the updated text.
  await new Promise(resolve => setTimeout(resolve, 10))
  let element = document.getElementById(id)

  if (element) {
    // If there is a fontSize from earlier, use that, otherwise go for 85px
    let fontSize = element.style.fontSize
      ? parseFloat(element.style.fontSize.slice(0, element.style.fontSize.length - 2))
      : 30

    // If element is bigger than screenWidth
    if (screenWidth - element.scrollWidth < -10) {
      while (screenWidth - element.scrollWidth < -10) {
        // ...down the font size
        fontSize--
        element.style.fontSize = `${fontSize}px`
        // Needed a micro waiting period here cuz otherwise the
        // element.scrollWidth didnt catch up and gave the old value -> infinitive loop
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    }

    // If element is smaller than screenWidth...
    else if (screenWidth - element.scrollWidth > 10) {
      while (screenWidth - element.scrollWidth > 10) {
        // ...up the font size
        fontSize++
        element.style.fontSize = `${fontSize}px`
        // Needed a micro waiting period here cuz otherwise the
        // element.scrollWidth didnt catch up and gave the old value -> infinitive loop
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    }
    // If not too big or too small, do nothing.
  }
}
