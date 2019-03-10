class NeuralNetwork //2 Layer NN
{
	constructor(arg, arg2, arg3)
	{
		this.input_nodes = arg; //layer 0
		this.hidden_nodes = arg2; //layer 1
		this.output_nodes = arg3; //layer 2

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
			noLoop();
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

	mutate(rate) { //rate 0 to 1
		function mutate(val) {
			if(Math.random() < rate) {
				// return Math.random() * 2 - 1;
				return val + randomGaussian(0,0.1);
			}
			else {
				return val;
			}
		}

		this.weights_ih.map(mutate);
		this.weights_ho.map(mutate);
		this.bias_h.map(mutate);
		this.bias_o.map(mutate);
	}
}

function sigmoid(x)
{
	return 1/(1+Math.exp(-1*x));
}

function derivative_sigmoid(y)
{
	return y*(1-y);
}