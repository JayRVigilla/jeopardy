//wait til DOM is loaded
$(async function () {

    const HEIGHT = 5;
    const WIDTH = 6;
    let answer = '';
    let guess = '';
    let question = '';
    let value = 0;
    let lastClicked = undefined;

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
                await $(`tr.${nthClue}`).append(`<td class="col-${nthClue} row-${i}"><div class="null value col-${nthClue} row-${i}">${(nthClue + 1) * 100}</div>
                <div class="question hidden">${catData.clues[nthClue].question}</div>
                <div class="answer col-${nthClue} row-${i} hidden">${catData.clues[nthClue].answer}</div>
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
     * - if currently "answer", ignore click
     * */
    function handleClick(evt) {
        $("#your-answer").show()

        if (this.classList.contains('null')) {
            value = $(this).text()
            answer = $(this).siblings('div.answer').text().toLowerCase()
            question = $(this).siblings('div.question').text()

            const altAnsPos = answer.indexOf("(")
            console.log(`altAnsPos ${altAnsPos}`)

            if (altAnsPos > -1) {
                let altAnsArr = answer.substring(altAnsPos + 4).split(",")
                console.log("altAnsArr", Array.isArray(altAnsArr))
                altAnsArr.push(answer.substring(0, altAnsPos - 1))
                const answers = altAnsArr.map(ans => ans.trim())
                console.log("answers", answers)
            }

            $(this).hide();
            $(this).siblings('div.question').show();
            $('#your-clue').text(question)
            lastClicked = $(evt.target).siblings('div.answer')
        }
    }

    function handleGuess() {
        const correct = (val) => {
            $('#score').text((parseInt($('#score').text()) + parseInt(val)).toString())
            $(lastClicked).addClass('correct')
        }
        const incorrect = (val) => {
            $('#score').text((parseInt($('#score').text()) - parseInt(val)).toString())
            $(lastClicked).addClass('incorrect')
        }
        guess = $('#guess').val()
        guess == null || guess.toLowerCase() !== answer ? incorrect(value) : correct(value)
        $(lastClicked).show()

        $('#your-answer').hide()
        $('#guess').val('')
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
        showLoadingView();
        fillTable();
        setTimeout(hideLoadingView, 3000);
    }
    hideLoadingView()
    $('body').on('click', '#start', function (evt) {
        $('.game-board').empty();
        setupAndStart();
    });
    $('table').on("click", "div", handleClick);
    $('#your-answer').on("click", 'button', handleGuess)
})