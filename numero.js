const GUESSES_ALLOWED = 6;
const NUM_DIGITS = 4;
let BLOCK_INPUT = false;

let LETTER_NODES = [];
let GUESSES = [];
let IN_PROGRESS = [];
let SOLUTION;

function Guess(digit, correct, in_answer){
	return {
		'digit': digit,
		'correct': correct,
		'in_answer': in_answer
	}

}
function main(){
	console.log("START");
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

	//load up data structure
	for (let i = 0; i < 4; i++){
		let ltr_row = [];
		for (let n = 0; n < 6; n++){
			const node = document.getElementsByName(`guess_${i}`)[n];
			console.log(node);
			ltr_row.push(node);
		}
		LETTER_NODES.push(ltr_row);
	}
}

function handleNumberClick(event){
	const num = event.target.innerHTML;
	if (BLOCK_INPUT) return;
	console.log(`LTR_INT is ${IN_PROGRESS.length}; value is ${num}`);

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
				console.log(guess_node);
				element.style.backgroundColor = "green";	
			}else if (guess_node.in_answer) {
				element.style.backgroundColor = "yellow";
			}else{
				element.style.backgroundColor = "lightgray";
			}
			
		}
	}
	for (let i = 0; i < NUM_DIGITS; i++){
		console.log(`DEBUG: ${i} ${NUM_DIGITS}`);
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
	let row = [];
	for (const position in IN_PROGRESS){
		// check correct (later)
		const digit = IN_PROGRESS[position];
		const in_answer = SOLUTION.indexOf(digit) > -1;
		const correct = SOLUTION.charAt(position) == digit;
		const guess = Guess(digit, correct, in_answer);
		
		row.push(guess);
	}
	GUESSES.push(row);
	if (row.every(item => item.correct === true)){
		solved(true);
		BLOCK_INPUT = true;
	}else if (GUESSES.length === GUESSES_ALLOWED) {
		solved(false);
	}
	IN_PROGRESS = [];
	redraw();
	BLOCK_INPUT = false;

	function solved(solved){
		document.getElementById("grid").style.display = "none";
		if (solved){
			document.getElementById("word").style.backgroundColor = "green";
		}else{
			document.getElementById("word").style.backgroundColor = "lightgray";
		}
		document.getElementById("word").innerHTML = `${SOLUTION}`;
	}
}

function handleDelete(){
	IN_PROGRESS.pop();
	redraw();
}