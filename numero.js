const GUESSES_ALLOWED = 6;
const NUM_DIGITS = 4;
let BLOCK_INPUT = false;

let LETTER_NODES = [];
let GUESSES = [];
let IN_PROGRESS = [];
let SOLUTION;

function Guess(index, digit, correct=false, in_answer=false){
	return {
		'index': index,
		'digit': digit,
		'correct': correct,
		'in_answer': in_answer
	}

}
function main(){

	let s = [];
	for (let i = 0; i < 4; i++){
		const randomInt = Math.floor(Math.random() * 9) + 1;
		s.push(randomInt);
	}
	SOLUTION = s.join('');
	console.log(`solution is ${SOLUTION}`);
	const numberInputs = document.getElementById('grid').children;
	for (const child of numberInputs){
		child.addEventListener('click', handleNumberClick);
	}
	document.getElementById('del').addEventListener('click', handleDelete);
	document.getElementById('enter').addEventListener('click', handleEnter);
	document.addEventListener('keydown', handleKeyPress);

	//load up data structure
	for (let i = 0; i < GUESSES_ALLOWED; i++){
		let ltr_row = [];
		for (let n = 0; n < NUM_DIGITS; n++){
			const node = document.getElementsByName(`guess_${i}`)[n];
			ltr_row.push(node);
		}
		LETTER_NODES.push(ltr_row);
	}
}

function handleKeyPress(event){
	// we need to let Enter and Backspace through before the block
	if (event.key === 'Enter') {
		handleEnter();
		return;
	}
	if (event.key === 'Backspace'){
		handleDelete();
		return;
	}
	if (BLOCK_INPUT) return;
	if (!'123456789'.includes(event.key)) return;
	const num = event.key;
	if (IN_PROGRESS.length >= NUM_DIGITS){
		BLOCK_INPUT = true;
		return;
	}
	IN_PROGRESS.push(num);
	redraw();
}
function handleNumberClick(event){
	const num = event.target.innerHTML;
	if (BLOCK_INPUT) return;
	if (IN_PROGRESS.length >= NUM_DIGITS){
		BLOCK_INPUT = true;
		return;
	}
	IN_PROGRESS.push(num);
	redraw();
}
function redraw(){
	// iterate through guesses then current
	const next_row = GUESSES.length;
	for (const row_num in GUESSES){
		const row = GUESSES[row_num];
		for (const node_num in row){
			const guess_node = row[node_num];
			const element = LETTER_NODES[row_num][node_num];
			element.innerHTML = guess_node.digit; // format 
			if (guess_node.correct){
				element.style.backgroundColor = "green";	
			}else if (guess_node.in_answer) {
				element.style.backgroundColor = "yellow";
			}else{
				element.style.backgroundColor = "lightgray";
			}
			
		}
	}
	for (let i = 0; i < NUM_DIGITS; i++){
		LETTER_NODES[next_row][i].innerHTML = '';
	}
	for (const node_num in IN_PROGRESS){
			LETTER_NODES[next_row][node_num].innerHTML = IN_PROGRESS[node_num];
	}
}

function handleEnter(){
	if (IN_PROGRESS.length < 4){
		return;
	}
	// First I'm going to make an array of Guess objects
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
	BLOCK_INPUT = false;

	function solved(solved){
		BLOCK_INPUT = true;
		document.getElementById("grid").style.display = "none";
		if (solved){
			document.getElementById("word").style.backgroundColor = "green";
		}else{
			document.getElementById("word").style.backgroundColor = "lightgray";
		}
		document.getElementById("word").innerHTML = `${SOLUTION}`;
		//document.getElementById("word").addEventListener("click", main);
	}
}

function handleDelete(){
	IN_PROGRESS.pop();
	redraw();
}