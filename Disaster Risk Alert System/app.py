from flask import Flask, render_template, request
import pickle
import numpy as np
import os

app = Flask(__name__)

# Load the model
model_path = os.path.join('model', 'disaster_model.pkl')
model = pickle.load(open(model_path, 'rb'))

@app.route('/')
def home():
    print("🏠 Home page loaded")  # Debugging print
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input values from the form
        temperature = float(request.form['temperature'])
        rainfall = float(request.form['rainfall'])
        wind_speed = float(request.form['wind_speed'])

        # Prepare input for the model
        input_data = np.array([[temperature, rainfall, wind_speed]])
        prediction = model.predict(input_data)[0]
        probability = model.predict_proba(input_data)[0][1] * 100  # Probability of class 1 (disaster)

        if prediction == 1:
            message = "⚠️ Warning: Disaster Likely!"
        else:
            message = "✅ Area is Safe."

        result = {
            'message': message,
            'probability': round(probability, 1),
            'inputs': {'temperature': temperature, 'rainfall': rainfall, 'wind_speed': wind_speed}
        }

        return render_template('index.html', result=result)

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        return render_template('index.html', result={'message': f"Error: {e}"})

if __name__ == '__main__':
    print("📂 Current working directory:", os.getcwd())
    app.run(debug=True)