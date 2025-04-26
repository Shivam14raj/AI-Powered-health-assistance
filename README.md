# AI-Powered-health-assistance

A machine learning-based web application that predicts possible health conditions based on user-reported symptoms, using TensorFlow.js.

Features
Symptom Input: Users can enter their symptoms.
Condition Prediction: AI model predicts the most likely health conditions.
Confidence Level: Each prediction shows a confidence (High, Medium, Low).
Fully Browser-Based: Runs completely in the browser using TensorFlow.js.

How It Works
Symptom Encoding:
50 common symptoms are mapped to numbers (like fever → 0, headache → 1, etc.).

Preprocessing:
Symptoms entered by the user are converted into a vector of size 50.
If a symptom is present, its position is marked as 1, otherwise 0.



Model Architecture:
Input Layer: 50 input features (symptoms).
Hidden Layers: Multiple layers (128 → 64 → 32 neurons) with ReLU activation.
Dropout: 20% dropout to avoid overfitting.
Output Layer: 20 possible conditions, using Softmax to predict probabilities.

Training:
Optimizer: Adam (learning rate 0.001).
Loss Function: Categorical Crossentropy.
Batch Size: 32 samples at a time.
Validation Split: 20% data used for validation.

Prediction:
The model predicts probabilities for each condition.
Returns top 3 conditions with confidence levels (High, Medium, Low).

Technologies Used
JavaScript
TensorFlow.js
HTML5/CSS3 (for UI)

Machine Learning Concepts:
One-Hot Encoding
Model Training
Overfitting Control (Dropout, Regularization)
Validation Split 

Future Improvements
Add more symptoms and conditions for broader diagnosis.
Include severity levels of symptoms.
Improve model accuracy with larger datasets.
Integrate doctor recommendation or emergency warning if critical conditions are detected.
