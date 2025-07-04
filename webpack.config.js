module.exports = {
  entry: './src/index.js',  // Entry point
  output: {
    filename: 'bundle.js',  // Output file
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Transpile JavaScript
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],  // File extensions to resolve
  },
  mode: 'development',  // Set mode explicitly to 'development'
};

