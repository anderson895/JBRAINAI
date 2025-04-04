from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

# Initialize Flask app
app = Flask(__name__)

# Load dataset and prepare AI model
dataset = pd.read_csv('data.csv', encoding='latin1')  # Or 'ISO-8859-1'


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
    return render_template('index.html') 

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message")
    
    if not user_input:
        return jsonify({"error": "No message provided"}), 400  # Return an error if no message is provided

    # Check if the question is about the e-commerce project
    if "ecommerce project" in user_input.lower():
        response = {
            "response": '''
                <img src="https://portfolio-delta-three-97.vercel.app/img/portfolio/adornsia.png" alt="E-commerce Sample Project" />
            '''
        }
    if "point of sale" in user_input.lower():
        response = {
            "response": '''
                <img src="https://portfolio-delta-three-97.vercel.app/img/portfolio/pos.png" alt="E-commerce Sample Project" />
            '''
        }
    # Check if the question is about programming languages
    elif "programming languages" in user_input.lower():
        response = {
            "response": '''
                <img width="325" align="center" src="https://github-readme-stats-salesp07.vercel.app/api/top-langs/?username=anderson895&hide=HTML&langs_count=8&layout=compact&theme=react&border_radius=10&size_weight=0.5&count_weight=0.5&exclude_repo=github-readme-stats" alt="top langs" />
            '''
        }

         # Check if the question is about programming languages
    elif "sample mobile game" in user_input.lower():
        response = {
            "response": '''
                <img width="325" align="center" src="https://portfolio-delta-three-97.vercel.app/img/portfolio/quiz_ninja.png" alt="top langs" />
            '''
        }

    elif "sample e-learning" in user_input.lower():
        response = {
            "response": '''
                <img width="325" align="center" src="https://portfolio-delta-three-97.vercel.app/img/portfolio/ProjactTeach.png" alt="top langs" />
            '''
        }
        
          # Check if the question is about programming languages
    elif "sample project" in user_input.lower():
        response = {
            "response": '''
                <iframe 
                    src="https://portfolio-delta-three-97.vercel.app/portfolio.html" 
                    width="100%" 
                    height="600" 
                    style="border: none;">
                    </iframe>
            '''
        }
    elif "portfolio" in user_input.lower():
        response = {
            "response": '''
                <iframe 
                    src="https://portfolio-delta-three-97.vercel.app/" 
                    width="100%" 
                    height="600" 
                    style="border: none;">
                    </iframe>
            '''
        }
    else:
        # Use the trained model for other questions
        predicted_response = model.predict([user_input])[0]
        response = {"response": predicted_response}
    
    return jsonify(response)

if __name__ == "__main__":
      app.run(host="0.0.0.0", port=5001)
