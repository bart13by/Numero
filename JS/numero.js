const GUESSES_ALLOWED = 6;
const NUM_DIGITS = 4;
let LETTER_NODES = [];
let GUESSES = [];
let IN_PROGRESS = [];
let SOLUTION;

function Guess(index, digit, correct=false, in_answer=false){
	// "class" for holding guess objects
	return {
		'index': index,
		'digit': digit,
		'correct': correct,
		'in_answer': in_answer
	}

}
function main(){
	/* initial set up function. Called on load */


	// Create an array of random NUM_DIGITS integers 0-9
	let s = [];
	for (let i = 0; i < 4; i++){
		const randomInt = Math.floor(Math.random() * 10);
		s.push(randomInt);
	}
	SOLUTION = s.join(''); // join the array into a 4-digit number string
	console.log(`solution is ${SOLUTION}`); // output for debugging/cheating

	// add handlers to all the number elements
	const numberInputs = document.getElementById('grid').children;
	for (const child of numberInputs){
		child.addEventListener('click', handleNumberClick);
	}
	document.getElementById('del').addEventListener('click', handleDelete);
	document.getElementById('enter').addEventListener('click', handleEnter);
	document.getElementById('reset').addEventListener('click', handleReset);
	document.addEventListener('keydown', handleKeyPress);
	
	//Create an array of arrays of Guess objects to update as user makes guesses 
	for (let i = 0; i < GUESSES_ALLOWED; i++){
		let ltr_row = [];
		for (let n = 0; n < NUM_DIGITS; n++){
			const node = document.getElementsByName(`guess_${i}`)[n];
			ltr_row.push(node);
		}
		LETTER_NODES.push(ltr_row);
	}
	redraw();
}


function handleReset(event){
	/* Event handler to clean up and start over */
	
	// Reset CSS stuff
	document.getElementById("grid").style.display = "grid";
	document.getElementById('reset').style.display = 'none';
	for (const child of document.getElementById('letters').children){
		child.innerHTML = '';
		child.classList.remove(...child.classList);
		child.classList.add("letter");

	}
	// Empty out globals
	LETTER_NODES = [];
	GUESSES = [];
	IN_PROGRESS = [];
    // Run main again
	main();
	
}

function handleKeyPress(event){
	/* Allow user to use the keypad to enter guesses*/

	// we need to let Enter and Backspace through before the block
	if (event.key === 'Enter') {
		handleEnter();
		return;
	}
	if (event.key === 'Backspace'){
		handleDelete();
		return;
	}
	// Exit if the in_progress row is full
	if (IN_PROGRESS.length >= NUM_DIGITS) return;
	// Exit if the key is not a number
	if (!'0123456789'.includes(event.key)) return;
	// add the number to the row and redraw
	IN_PROGRESS.push(event.key);
	redraw();
}

function handleNumberClick(event){
	/* Handle click/tap on the on-screen number pad */

	// Exit if the input row is full
	if (IN_PROGRESS.length >= NUM_DIGITS) return;
	
	// Add the number to the row and redraw
	IN_PROGRESS.push(event.target.innerHTML);
	redraw();
}
function redraw(){
	/* 
	 * Redraw the UI. LETTER_NODES is an array of elements for displaying the guesses;
     * GUESSES is an array of rows of guess objects
	*/

	// First redraw all the guesses already in the bank
	const next_row = GUESSES.length; // get the index for the next row
	for (const row_num in GUESSES){ //iterate through the rows o
		const row = GUESSES[row_num];
		for (const node_num in row){ // iterate through the digits in each guess
			const guess_node = row[node_num];
			const element = LETTER_NODES[row_num][node_num];
			element.innerHTML = guess_node.digit; // set the value of the digit
			if (guess_node.correct){ // set CSS to indicate status
				element.classList.add("correct");
			}else if (guess_node.in_answer) {
				element.classList.add("in-answer");
			}else{
				element.classList.add("incorrect");
			}
			
		}
	}
	// Now redraw any guesses in progress
	for (let i = 0; i < NUM_DIGITS; i++){
		LETTER_NODES[next_row][i].innerHTML = '';
	}
	for (const node_num in IN_PROGRESS){
			LETTER_NODES[next_row][node_num].innerHTML = IN_PROGRESS[node_num];
	}
}

function handleEnter(){
	/* Key or button, get the IN_PROGRESS guess digits and put them in the bank */

	// Exit if the row is not full
	if (IN_PROGRESS.length < NUM_DIGITS) return;
	
	
	let guesses = [];
	for (const position in IN_PROGRESS){	
		guesses.push(Guess(position, IN_PROGRESS[position]));
	}


	for (let i = 0; i < SOLUTION.length; i++){
		const guess = guesses[i];
		const s_digit = SOLUTION.charAt(i);
		if (guess.digit == s_digit){
			guess.correct = true;
			continue;
		}
		inner:
		for (let n = 0; n < SOLUTION.length; n++){
			if (guesses[n].in_answer || guesses[n].correct) continue;
			if (guesses[n].digit == s_digit){
				guesses[n].in_answer = true;
				break inner;
			} 
		}
	}
	GUESSES.push(guesses);
	if (guesses.every(item => item.correct === true)){
		solved(true);
	}else if (GUESSES.length === GUESSES_ALLOWED) {
		solved(false);
	}

	IN_PROGRESS = [];
	redraw();
	

	function solved(solved){
		/* Close the puzzle for input and do the final "solve state" formatting */
		document.removeEventListener('keydown', handleKeyPress);
		document.getElementById("grid").style.display = "none";
		if (solved){ // Ugh, I should change these to classes
			document.getElementById("word").style.backgroundColor = "green";
		}else{
			document.getElementById("word").style.backgroundColor = "lightgray";
		}
		document.getElementById("word").innerHTML = `${SOLUTION}`;
		document.getElementById('reset').style.display = 'block';
	}
}

function handleDelete(){
	/* Self-explanatory */
	IN_PROGRESS.pop();
	redraw();
}