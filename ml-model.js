class SymptomAnalyzer {
    constructor() {
        this.model = null;
        this.symptomEncoder = null;
        this.conditionEncoder = null;
        this.isModelLoaded = false;
        this.trainingHistory = [];
    }

    async initialize() {
        try {
            if (!window.tf) {
                throw new Error('TensorFlow.js not loaded');
            }

            // Create a more sophisticated neural network model
            // This initializes a Sequential model in TensorFlow.js, meaning the layers are stacked one after the other
            this.model = window.tf.sequential();
            
            // Input layer
            this.model.add(window.tf.layers.dense({
                units: 128,
                activation: 'relu',
                inputShape: [50],
                kernelRegularizer: window.tf.regularizers.l2(0.01)
            }));
            
            this.model.add(window.tf.layers.dropout(0.3));
            
            // Hidden layers
            this.model.add(window.tf.layers.dense({
                units: 64,
                activation: 'relu',
                kernelRegularizer: window.tf.regularizers.l2(0.01)
            }));
            
            this.model.add(window.tf.layers.dropout(0.2));
            
            this.model.add(window.tf.layers.dense({
                units: 32,
                activation: 'relu',
                kernelRegularizer: window.tf.regularizers.l2(0.01)
            }));
            
            // Output layer
            this.model.add(window.tf.layers.dense({
                units: 20,
                activation: 'softmax'
            }));

            // Compile the model with better optimizer settings
            this.model.compile({
                optimizer: window.tf.train.adam(0.001),
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy', 'precision', 'recall']
            });

            // Initialize symptom and condition encoders
            this.initializeEncoders();
            
            this.isModelLoaded = true;
            console.log('ML Model initialized successfully');
        } catch (error) {
            console.error('Error initializing ML model:', error);
            this.isModelLoaded = false;
            throw error;
        }
    }

    initializeEncoders() {
        // Enhanced symptom encoder with more detailed mappings
        this.symptomEncoder = {
            // Physical symptoms
            'fever': 0, 'headache': 1, 'cough': 2, 'fatigue': 3, 'nausea': 4,
            'dizziness': 5, 'chest pain': 6, 'shortness of breath': 7, 'muscle pain': 8,
            'sore throat': 9, 'stress': 10, 'anxiety': 11, 'depression': 12,
            'insomnia': 13, 'stomach pain': 14, 'diarrhea': 15, 'constipation': 16,
            'rash': 17, 'itching': 18, 'joint pain': 19, 'back pain': 20,
            'eye problems': 21, 'ear problems': 22, 'weight loss': 23, 'weight gain': 24,
            'memory problems': 25, 'tremors': 26,
            
            // Additional symptoms
            'chills': 27, 'sweating': 28, 'loss of appetite': 29, 'vomiting': 30,
            'abdominal pain': 31, 'bloating': 32, 'heartburn': 33, 'difficulty swallowing': 34,
            'palpitations': 35, 'swelling': 36, 'numbness': 37, 'tingling': 38,
            'confusion': 39, 'mood changes': 40, 'irritability': 41, 'difficulty concentrating': 42,
            'sleep disturbances': 43, 'night sweats': 44, 'muscle weakness': 45,
            'balance problems': 46, 'speech problems': 47, 'vision changes': 48,
            'hearing problems': 49
        };      

        // Enhanced condition encoder with more specific conditions
        this.conditionEncoder = [
            'Common Cold', 'Flu', 'Viral Infection', 'Bacterial Infection',
            'Migraine', 'Tension Headache', 'Sinusitis', 'Dehydration',
            'Stress', 'Anxiety', 'Depression', 'Sleep Disorders',
            'High Blood Pressure', 'Diabetes', 'Heart Disease', 'Asthma',
            'Arthritis', 'Thyroid Issues', 'Digestive Issues', 'Skin Conditions'
        ];
    }

    preprocessSymptoms(symptoms) {
        try {
            // Create a zero vector of size 50 (our input size)
            const symptomVector = new Array(50).fill(0);  
            
            // Convert symptoms to vector with weighted importance
            symptoms.forEach(symptom => {
                const index = this.symptomEncoder[symptom.toLowerCase()];
                if (index !== undefined) {
                    // Add symptom with weight based on its importance
                    symptomVector[index] = 1;        
                }
            });
            
            return window.tf.tensor2d([symptomVector]);
        } catch (error) {
            console.error('Error preprocessing symptoms:', error);
            throw error;
        }
    }

    async analyzeSymptoms(symptoms) {
        if (!this.isModelLoaded) {
            throw new Error('Model not loaded');
        }

        try {
            // Preprocess symptoms
            const inputTensor = this.preprocessSymptoms(symptoms);
            
            // Get predictions
            const predictions = await this.model.predict(inputTensor).data();
            
            // Get top 3 conditions with confidence scores
            const topConditions = this.getTopConditions(predictions, 3);
            
            // Clean up tensors
            inputTensor.dispose();
            
            return topConditions;
        } catch (error) {
            console.error('Error analyzing symptoms:', error);
            throw error;
        }
    }

    getTopConditions(predictions, topK) {
        try {
            // Create array of [index, probability] pairs
            const indexedPredictions = predictions.map((prob, index) => [index, prob]);
            
            // Sort by probability in descending order
            indexedPredictions.sort((a, b) => b[1] - a[1]);
            
            // Get top K conditions with confidence scores
            return indexedPredictions.slice(0, topK).map(([index, prob]) => ({
                condition: this.conditionEncoder[index],
                probability: prob,
                confidence: this.getConfidenceLevel(prob)
            }));
        } catch (error) {
            console.error('Error getting top conditions:', error);
            throw error;
        }
    }

    getConfidenceLevel(probability) {
        if (probability >= 0.8) return 'High';
        if (probability >= 0.5) return 'Medium';
        return 'Low';
    }

    async trainModel(trainingData) {
        if (!this.isModelLoaded) {
            throw new Error('Model not loaded');
        }

        try {
            const { symptoms, conditions } = trainingData;
            
            // Convert symptoms to tensors
            const inputTensor = this.preprocessSymptoms(symptoms);
            
            // Convert conditions to one-hot encoded tensors
            const outputTensor = window.tf.oneHot(
                window.tf.tensor1d(conditions.map(c => this.conditionEncoder.indexOf(c))),
                20
            );
            
            // Train the model with early stopping and validation
            const result = await this.model.fit(inputTensor, outputTensor, {
                epochs: 50,
                batchSize: 32,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        this.trainingHistory.push({
                            epoch: epoch + 1,
                            loss: logs.loss,
                            accuracy: logs.acc,
                            valLoss: logs.val_loss,
                            valAccuracy: logs.val_acc
                        });
                        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
                    },
                    onTrainEnd: () => {
                        console.log('Training completed');
                        this.saveModel();
                    }
                }
            });
            
            // Clean up tensors
            inputTensor.dispose();
            outputTensor.dispose();
            
            return result;
        } catch (error) {
            console.error('Error training model:', error);
            throw error;
        }
    }

    async saveModel() {
        try {
            // Save model to browser's local storage
            const modelJSON = this.model.toJSON();
            localStorage.setItem('symptomAnalyzerModel', JSON.stringify(modelJSON));
            console.log('Model saved successfully');
        } catch (error) {
            console.error('Error saving model:', error);
        }
    }

    async loadModel() {
        try {
            const savedModel = localStorage.getItem('symptomAnalyzerModel');
            if (savedModel) {
                const modelJSON = JSON.parse(savedModel);
                this.model = await window.tf.models.modelFromJSON(modelJSON);
                this.model.compile({
                    optimizer: window.tf.train.adam(0.001),
                    loss: 'categoricalCrossentropy',
                    metrics: ['accuracy', 'precision', 'recall']
                });
                console.log('Model loaded successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading model:', error);
            return false;
        }
    }

    getModelMetrics() {
        return {
            trainingHistory: this.trainingHistory,
            isModelLoaded: this.isModelLoaded
        };
    }
}

// Export the SymptomAnalyzer class
export default SymptomAnalyzer; 