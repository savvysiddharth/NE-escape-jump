function sigmoid(x)
{
	return 1/(1+Math.exp(-1*x));
}

function derivative_sigmoid(y)
{
	return y*(1-y);
}

class NeuralNetwork //2 Layer NN
{
	constructor(numI, numH, numO)
	{
		this.input_nodes = numI; //layer 0
		this.hidden_nodes = numH; //layer 1
		this.output_nodes = numO; //layer 2

		this.weights_ih = new Matrix(this.hidden_nodes,this.input_nodes); //weights b/w input and hidden 
		this.weights_ho = new Matrix(this.output_nodes,this.hidden_nodes);//weights b/w hidden and output
		this.weights_ih.randomize();
		this.weights_ho.randomize();

		this.bias_h = new Matrix(this.hidden_nodes,1); //bias at hidden
		this.bias_o = new Matrix(this.output_nodes,1); //bias at output
		this.bias_h.randomize();
		this.bias_o.randomize();

		this.learning_rate = 0.1;
	}

	feedforward(input_array)
	{
		//argument validation code - START
		let invalid=false;
		if(input_array.length != this.input_nodes)
		{
			invalid=true;
			console.log("Input array to feedforward function has invalid size.")
		}
		if(invalid)
		{	
			console.error("Network feedforward failed : invalid arguments!");
			return -1;
		}
		//argument validation code - END


		let input = Matrix.fromArray(input_array);
		//generating hidden output
		let hidden = Matrix.multiply(this.weights_ih,input);
		hidden.add(this.bias_h);
		//activation
		hidden.map(sigmoid);

		//generating output's output
		let output = Matrix.multiply(this.weights_ho,hidden);
		output.add(this.bias_o);
		//activation
		output.map(sigmoid);

		return output.toArray();
	}

	train(input_array,target_array)
	{
		//argument validation - START
		let invalid = false;
		if(input_array.length != this.input_nodes)
		{
			console.log('Input array to train function has invalid size.');
			invalid=true;
		}
		if(target_array.length != this.output_nodes)
		{
			invalid=true;
			console.log('Target array to train function has invalid size.');
		}
		if(invalid)
		{
			console.error("Training failed : invalid arguments!");
			return -1;
		}
		//argument validation - END


		//Feedforward - START - NEED IMPROVEMENT HERE
		let input = Matrix.fromArray(input_array);
		let hidden = Matrix.multiply(this.weights_ih,input);
		hidden.add(this.bias_h);
		hidden.map(sigmoid);
		let output = Matrix.multiply(this.weights_ho,hidden);
		output.add(this.bias_o);
		output.map(sigmoid);
		//Feedforward - END

		let target = Matrix.fromArray(target_array);
		
		//calc error = targets - outputs
		let output_error = Matrix.add(target, Matrix.multiply(output,-1));

		//calc output gradient and delta weights bw ho
		let output_gradient = Matrix.map(output,derivative_sigmoid);
		output_gradient.multiply(output_error);
		output_gradient.multiply(this.learning_rate);

		let hidden_t = Matrix.transpose(hidden);
		let weights_ho_delta = Matrix.multiply(output_gradient,hidden_t);

		//UPDATING WEIGHTS and BIASES
		this.weights_ho.add(weights_ho_delta);
		this.bias_o.add(output_gradient);

		//calc hidden layer error
		let weights_ho_t = Matrix.transpose(this.weights_ho); //transposed
		let hidden_error = Matrix.multiply(weights_ho_t,output_error);

		//calc hidden gradient and delta weights bw ih
		let hidden_gradient = Matrix.map(hidden,derivative_sigmoid);
		hidden_gradient.multiply(hidden_error);
		hidden_gradient.multiply(this.learning_rate);

		let input_t = Matrix.transpose(input);
		let weights_ih_delta = Matrix.multiply(hidden_gradient,input_t);

		//UPDATING WEIGHTS and BIASES
		this.weights_ih.add(weights_ih_delta);
		this.bias_h.add(hidden_gradient);
	}
}