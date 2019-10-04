function nextGeneration(prevGen) {

  let newGen = [];
  for(let i=0 ; i<TOTAL_BALL_POPULATION ; i++) {
    newGen[i] = new Ball();
    newGen[i].x = random(10,width-10);
  }

  //get fitness
  getFitness(prevGen);

  //natural selection and crossover
  for(let i=0 ; i<TOTAL_BALL_POPULATION ; i++) {
    const brain1 = natureSelects(prevGen).brain.copy();
    const brain2 = natureSelects(prevGen).brain.copy();
    newGen[i].brain = brain1.crossover(brain2);
  }

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
  return Gen[index]; // return naturally selected element
}

function mutate(Gen) {
  for(ball of Gen) {
    ball.brain.mutate(0.1); //set mutation rate
  }
}