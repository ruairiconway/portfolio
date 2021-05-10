import serpentesMain from './images/serpentesMain.png'
import serpentesThumbnail from './images/serpentesThumbnail.png'
import npsMain from './images/npsMain.png'
import npsThumbnail from './images/npsThumbnail.png'
import bookClubMain from './images/bookClubMain.png'
import bookClubThumbnail from './images/bookClubThumbnail.png'
import notflixMain from './images/notflixMain.png'
import notflixThumbnail from './images/notflixThumbnail.png'

export const portfolioData = [
    {
        id: 1,
        name: "Serpentes",
        caption: "Who doesn’t like a classic game of 'snake'?",
        image_main: serpentesMain,
        image_thumb: serpentesThumbnail,
        image_alt: "preview of the Serpentes website",
        url: "https://ruairiconway.github.io/serpentes/",
        github: "https://github.com/ruairiconway/serpentes",
        desc: 'Built atop a grid array, this simple game of snake runs on JavaScript(ES6+) and user interaction.',
        highlights: [
            "The movement, growth, and speed logic revolve around array manipulation.",
            "To improve accessibility, users can move the snake via key or mouse controls.",
            "When the snake reaches a treat, it grows and speeds up.",
            "The game ends when the snake hits itself or the edges."
        ],
        todos: [
            "Add scoreboard functionality where users can post highscores."
        ],
        skills: [
            "JavaScript (ES6+)",
            "HTML5",
            "CSS"
        ],
    },
    {
        id: 2,
        name: "Notflix",
        caption: "A clone of Netflix for educational purposes.",
        image_main: notflixMain,
        image_thumb: notflixThumbnail,
        image_alt: "preview of the Notflix website",
        url: "https://ruairiconway.github.io/project1/",
        github: "https://github.com/ruairiconway/notflix",
        desc: "--IN PROGRESS--",
        highlights: [
            "Large React based architecture.",
            "Makes use of styled + compound components.",
            "Uses Firebase to handle Notflix data and sign-in authentication.",
            "Live search implemented using Fuse.js.",
            "Mobile responsive."
        ],
        todos: [
            "Form / Sign in components.",
            "Browse page.",
            "Search feature.",
            "Dropdown profiles.",
            "Card components for Notflix catalogue.",
            "Video player component."
        ],
        skills: [
            "React",
            "React Router",
            "React Hooks",
            "Styled Components",
            "Fuse.js",
            "Firebase",
            "CSS",
            "Javascript(ES6+)"
        ],
    },
    {
        id: 3,
        name: "*Unofficial NPS Directory",
        caption: "Search for National Parks in your state.",
        image_main: npsMain,
        image_thumb: npsThumbnail,
        image_alt: "preview of the Unofficial NPS Directory website",
        url: "https://ruairiconway.github.io/national-parks-directory/",
        github: "https://github.com/ruairiconway/national-parks-directory",
        desc: "Using the National Parks Service API, this directory can return a list of parks by state. Park details include location, contact, and opening times, as well as any current announcemeents/warnings or active webcams.",
        highlights: [
            "Uses National Parks Service REST API",
            "API key protected using Heroku app as proxy.",
            "Users can browse parks by state.",
            "Results are alphabetical.",
            "On load, site displays random quote from bank of options."
        ],
        todos: [
            "Add Google Map external link to park addresses.",
            "Test image load times to experiment with performance.",
            "Change form function so users can search by multiple states or by park name."
        ],
        skills: [
            "REST API",
            "Heroku",
            "JavaScript (ES6+)",
            "CSS",
            "HTML5"
        ],
    },
    {
        id: 4,
        name: "Book Club",
        caption: "A new years resolution to read one book every month.",
        image_main: bookClubMain,
        image_thumb: bookClubThumbnail,
        image_alt: "preview of the Book Club website",
        url: "https://ruairiconway.github.io/book-club/",
        github: "https://github.com/ruairiconway/book-club",
        desc: "As part of a new years resolution, I'm trying to read one book per month. To help me on my way, I built this site as an excuse to show off the books as well as some new learning in jQuery + CSS.",
        highlights: [
            "Mobile first design.",
            "Formspree integration where visitors can make recommendations.",
            "Users can navigate using scroll, swipe, or arrow keys for accessibility",
            "Renders current month on load.",
            "Uses Hammer.js plugin to help with mobile interface."
        ],
        todos: [
            "Fix month iteration bug when switching between arrow keys and scroll.",
            "Add in UI prompts for scrolling between months.",
            "Collapse description on mobile and make it toggleable."
        ],
        skills: [
            "JQuery",
            "CSS",
            "HTML5"
        ],
    }
]