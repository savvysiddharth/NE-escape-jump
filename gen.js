function nextGeneration(prevGen) {

  let newGen = [];
  for(let i=0 ; i<TOTAL_BALL_POPULATION ; i++) {
    newGen[i] = new Ball();
    newGen[i].x = random(10,width-10);
  }

  //get fitness
  getFitness(prevGen);

  //natural selection
  for(let i=0 ; i<TOTAL_BALL_POPULATION ; i++) {
    newGen[i].brain = natureSelects(prevGen).brain;
  }

  //crossover

  //mutation
  mutate(newGen);

  return newGen;
}

//calcs fitness val from seconds survived
function getFitness(Gen) {
  let sum = 0;
  for(ball of Gen) {
    sum += ball.fitness_score;
  }

  for(ball of Gen) {
    ball.fitness_score = ball.fitness_score/sum;
  }
}

function natureSelects(Gen) {
  //define seletion
  let r = random(0,1);
	let index = 0;

	while(r > 0) {
		r = r - Gen[index].fitness_score;
		index++;
	}
	index--;

  // console.log('ball',index,'selected');
  return Gen[index]; // array of 2 elements
}

function crossover(selected) {

  //define crossover

  return offspring;
}

function mutate(Gen) {
  for(ball of Gen) {
    ball.brain.mutate(0.1); //set mutation rate
  }
}