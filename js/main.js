//VARIABLES
/*----------------------------------------------------------------------------*/

//pagination variables
let $pagination;
let $ul;
let $studentList = $(`.student-item`);
let maxStudentsPerPage = 10;

//search section variables
let newMatchedStudents = [];
let $searchDiv;
let $refreshButton;
let $searchSection;

//###Functions
/*-----------------------------------------------------------------------------*/

/*create SHOWPAGE function to first hide the page of all student links.
then show the page with the correct number of students (10) on the page*/
const showPage = (pageNumber, showStudentList) => {
  //hide all student links
  $($studentList).hide();

  //loop through all students in the student list argument
  for (let i = 0; i < showStudentList.length; i++) {
    //decide if student should be on the page by using "if" statement
    if (i < pageNumber * maxStudentsPerPage && i + 1 > (pageNumber - 1) * maxStudentsPerPage) {
      //show selected array of students
      $(showStudentList[i]).show();
    }
  }
};

//create CREATEPAGINATION function to append buttons based on the amount of students in the array
const createPagination = (appendStudents) => {
  /*create the pagination section and append to page.
  give the div the class of 'pagination from design.css file.*/
  $pagination = $(`<div class ="pagination"</div>`);
  $ul = $('<ul></ul>');

  //append pagination section to page
  $(`.page`).append($pagination);

  //decide how many buttons are needed.
  let $buttonsNeeded = Math.ceil(appendStudents.length / maxStudentsPerPage);

  //create a "for loop" to create and append each button
  // to pagination section on page
  for (let i = 1; i <= $buttonsNeeded; i++) {
    //create each button link 'i'
    let $buttons = (`<li><a href="#"> ${i} </a></li>`);

    //append buttons to the ul element in tha pagination section
    $($ul).append($buttons);

    //select the pagination class and append buttons to pagination section of page
    $(`.pagination`).append($ul);

    //show page 1 on load
    if (i === 1) {
      showPage(1, appendStudents);

      //show button 1 as active on load by adding the class 'active' to the anchor tag
      $(`.pagination ul li a`).attr(`class`, `active`);
    }
  }

  //create click event handler for buttons

  $(`.pagination li a`).click(function () {
    //create variable to hold the text (value of i) of the button clicked
    let $selectedButton = $(this).text();

    // when the event handler is activated by the click of the button,
    //run the showPage function with the selectedButton value of the button pressed
    showPage($selectedButton, appendStudents);

    //remove the class 'active' from the current button
    $(`.active`).removeClass(`active`);

    //add the class 'active' to the button that was selected
    //to show which page is currently being displayed
    $(this).addClass(`active`);
  });

};

//create  SEARCHLIST function
//create a search div with the class of 'student-search'
const searchList = () => {
  //set the search value to 0
  newMatchedStudents.length = 0;

  //capture the value the user put into the search input field
  let $userInputValue = $(`#searchInput`).val().toLowerCase();

  //remove previous pagination section
  $(`.pagination`).remove();

  //loop over the student list
  for (let i = 0; i < $studentList.length; i++) {
    //2. get the students name from list with the find method
    let $studentName = $($studentList[i]).find(`h3`);

    //get the students email from list with find method
    $studentEmail = $($studentList[i]).find(`.email`);

    /*check if the user search input value is in the email or name. use the indexOf method on
  the student name and email to find the fist occurrence of the letters in the $userInputValue.*/
    if ($studentName.text().indexOf($userInputValue) !== -1 || $studentEmail.text().indexOf($userInputValue) !== -1) {
      //push matched students to the newMatchedStudent Array.
      //use jquery .parents method to select the parent element of the matched name and email
      newMatchedStudents.push($($studentName, $($studentEmail)).parents(`.student-item`));

      //hide the student list
      $($studentList).hide();

      //display message to show how many matches were found
      $(`.page-header h2`).text(`There are ${newMatchedStudents.length} student(s) found based on your search terms.`);
      $(`.page-header h2`).css(`color`, `green`);

    }
  }

  /*if no matches are found and the newMatchedStudents array is 0
  show a message that no students were found*/
  if (newMatchedStudents.length === 0) {
    //hide the student list
    $($studentList).hide();

    //display message to show that no results were found
    $(`.page-header h2`).text(`Sorry 0 students found. please refresh and try again.`).css(`color`, `red`);
  }

  /*if over ten students were found call createPagination function
  with the newMatcherdstudents array as an arguement*/
  if (newMatchedStudents.length > 10) {
    createPagination(newMatchedStudents);
  }

  //call the showpage function to display the first ten students of the matched list
  showPage(1, newMatchedStudents);
};

//create REFRESH fucntion for the user after a search is preformed
const refreshPage = () => {
  location.reload();
};

//###Create and append Search div and Call functions
/*-----------------------------------------------------------------------------*/

//create search div
$searchDiv =  $(`<div class= "student-search"></div>`);

//append the search div to the page header
$(`.page-header`).append($searchDiv);

//append search input and search button to search div
$searchDiv.append(`<input id="searchInput"><button class="search">Search</button>`);

//create and append refresh button to search div
$refreshButton = $(`<button class= "refresh">Refresh</button>`);
$searchDiv.append($refreshButton);

/*call the createPagination function with the argument
of the student list this adds pagination to the page*/
createPagination($studentList);

//place the event handler on the search button and pass the seach list function as an agument
$(`.search`).click(searchList);

//place the event handler on the refresh button and pass the refreshPage function as an agument
$($refreshButton).click(refreshPage);
