from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

# Initialize Flask app
app = Flask(__name__)

# Load dataset and prepare AI model
dataset = pd.read_csv('data.csv')

# Make sure the column names are correct based on your dataset
# Check the dataset for correct column names, assuming the columns are 'Question' and 'Answer'
dataset.columns = [col.strip().lower() for col in dataset.columns]  # Ensure column names are lowercase and stripped of spaces

# Create a pipeline with TF-IDF and a Logistic Regression model
model = make_pipeline(
    TfidfVectorizer(),
    LogisticRegression(solver='liblinear')
)

# Train the model with the dataset
model.fit(dataset['question'], dataset['answer'])

@app.route('/')
def home():
    return render_template('index.html')  # This serves the index.html file

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message")
    
    # Predict the response using the trained model
    predicted_response = model.predict([user_input])[0]
    
    return jsonify({"response": predicted_response})

if __name__ == "__main__":
      app.run(host="0.0.0.0", port=5001)
