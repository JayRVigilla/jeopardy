//wait til DOM is loaded
$(async function () {

    const HEIGHT = 5;
    const WIDTH = 6;

    /** Fill the HTML table#jeopardy with the categories & cells for questions.
     *
     * - The <thead> should be filled w/a <tr>, and a <td> for each category
     * - The <tbody> should be filled w/NUM-QUESTIONS_PER_CAT <tr>s,
     *   each with a question for each category in a <td>
     *   (initally, just show a "?" where the question/answer would go.)
     */

    async function fillTable() {
        // take glogal categories and an array of getCategoryIds()
        let catIds = await getCategoryIds(categories);
        // create thead with a tr containing WIDTH*td
        let $topRail = $('.game-board').append("<thead class=\"top-rail\"></thead>");
        let $tableRow = $('.game-board thead').append("<tr></tr>");
        for (let id of catIds) {
            let catData = await getCategory(id);
            $('tr').append(`<td>${catData.title}</td>`)
        }
        $topRail.append($tableRow);

        //create row of question cards from each category
        async function makeQuestionRow(catIDs, nthClue) {
            //go to each id in catIds and pull the Nth clue object inside to populate card
            for (let i = 0; i < catIDs.length; i++) {
                let catData = await getCategory(catIds[i]);
                await $(`tr.${nthClue}`).append(`<td><div class="null value">${(nthClue + 1) * 100}</div>
                <div class="question hidden">${catData.clues[nthClue].question}</div>
                <div class="answer hidden">${catData.clues[nthClue].answer}</div>
                    </td >`);
            }

        }
        // // should make a row and give index of nthClue

        for (let rows = 0; rows < HEIGHT; rows++) {
            $('.game-board').append(`<tr class="${rows}"></tr>`);
            await makeQuestionRow(catIds, rows);
        }

    }

    /** Handle clicking on a clue: show the question or answer.
     *
     * Uses .showing property on clue to determine what to show:
     * - if currently null, show question && set .showing to "question"
     * - if currently "question", show answer & set .showing to "answer"
     * - if curerntly "answer", ignore click
     * */
    function handleClick(evt) {
        const correct = (val) => {
            $('#score').text((parseInt($('#score').text()) + parseInt(val)).toString())
            $(this).parent().addClass('correct')
        }
        const incorrect = (val) => {
            $('#score').text((parseInt($('#score').text()) - parseInt(val)).toString())
            $(this).parent().addClass('incorrect')
        }

        if (this.classList.contains('null')) {
            const value = $(this).text()
            const answer = $(this).siblings('div.answer').text().toLowerCase()
            const guess = prompt($(this).siblings('div.question').text())

            $(this).hide();
            $(this).siblings('div.question').show();

            guess == null || guess.toLowerCase() !== answer ? incorrect(value) : correct(value)
            $(this).siblings('div.answer').show();
            $(this).siblings('div.question').addClass('asked');
        }
    }


    /** Wipe the current Jeopardy board, show the loading spinner,
     * and update the button used to fetch data.
     */
    function showLoadingView() {
        $('.loading').show();
        // using jQuery .animate() syntax found in a CodePen by Hideyuki Tabata
        $('.fas').animate(
            { deg: 720 },
            {
                duration: 3000,
                step: function (now) {
                    $(this).css({ transform: 'rotate(' + now + 'deg)' });
                }
            }
        )
    }

    /** Remove the loading spinner and update the button used to fetch data. */
    function hideLoadingView() {
        $('.loading').hide();
        $('.game-board').show();
    }

    /** Start game:
     *
     * - get random category Ids
     * - get data for each category
     * - create HTML table
     * */

    function setupAndStart() {
        $(".game-board").hide();
        fillTable();
        showLoadingView();
        setTimeout(hideLoadingView, 3000);
    }

    $('body').on('click', '#start', function (evt) {
        $('.game-board').empty();
        setupAndStart();
    });
    $('table').on("click", "div", handleClick);
})