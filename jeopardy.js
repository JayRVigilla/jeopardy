// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const BASE_URL = "http://jservice.io/api/"
//random categories to be used for each game
let categories = getCategoryIds;



/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
// use LODASH:
// get list of 100 (max limit) categories
// .shuffle() the big array
// if categories.length < 6 get more random categories, ELSE
// For this board take 6 categories from the front and splice the list


async function getCategoryIds() {
    // get 100 categories, the max allowed for a varied dataset to shuffle
    let response = await axios.get(`${BASE_URL}/categories`, {
        params: {
            count: 100,
        }
    });
    let categories = _.shuffle(response.data);
    categories.splice(6, 99);
    let catIds = [];
    for (let category of categories) catIds.push(category.id);
    return catIds;
}



/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
async function getCategory(catId) {
    // get category data (response) from API, takes category ID
    let response = await axios.get(`${BASE_URL}category`, {
        params: {
            id: catId,
        }
    });

    // creates array of clue objects where each clue has question and answer keys & vals
    // response.data.clues   //where the array of clue objects are kept, need answer and question from each
    function makeClueArr(responseClues) {
        let clueArr = []
        for (let clue of responseClues) {
            let clueObj = {
                question: clue.question,
                answer: clue.answer,
            }
            clueArr.push(clueObj);
        };
        return clueArr
    }
    // category data object is created with title and clue array to fill the board
    // response.data.title   //category title
    let catData = {
        title: response.data.title,
        clues: makeClueArr(response.data.clues),
    };
    return catData;
}