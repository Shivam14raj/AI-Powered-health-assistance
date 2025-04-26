import SymptomAnalyzer from './ml-model.js';

document.addEventListener('DOMContentLoaded', async () => { 
    // why async coz let everyhting load first(html and css)
    const analyzeBtn = document.getElementById('analyze-btn');
    const symptomsInput = document.getElementById('symptoms');
    const durationSelect = document.getElementById('duration');
    const loadingDiv = document.getElementById('loading');
    const resultsContent = document.getElementById('results-content');
    const conditionsList = document.getElementById('conditions-list');
    const recommendationsList = document.getElementById('recommendations-list');
    const severityBar = document.getElementById('severity-bar');
    const severityText = document.getElementById('severity-text');

    let symptomAnalyzer = null;
    let mlModelAvailable = false;

    try {
        // Initialize ML model
        symptomAnalyzer = new SymptomAnalyzer(); 
        // we are creating object of (symtomAnalyzer) that we created earlier
        await symptomAnalyzer.initialize();

        // Enhanced training data with more comprehensive examples
        const trainingData = {
            symptoms: [
                // Respiratory conditions
                ['fever', 'cough', 'fatigue', 'sore throat', 'runny nose'],
                ['cough', 'shortness of breath', 'chest pain', 'fatigue'],
                ['fever', 'cough', 'body aches', 'fatigue', 'headache'],
                ['sore throat', 'fever', 'swollen lymph nodes', 'fatigue'],
                ['cough', 'wheezing', 'shortness of breath', 'chest tightness'],
                
                // Neurological conditions
                ['headache', 'nausea', 'dizziness', 'sensitivity to light'],
                ['headache', 'fever', 'stiff neck', 'confusion'],
                ['dizziness', 'balance problems', 'nausea', 'vomiting'],
                ['headache', 'vision problems', 'nausea', 'vomiting'],
                ['memory problems', 'confusion', 'personality changes', 'difficulty speaking'],
                
                // Mental health conditions
                ['stress', 'anxiety', 'insomnia', 'fatigue'],
                ['depression', 'fatigue', 'sleep problems', 'loss of interest'],
                ['anxiety', 'panic attacks', 'shortness of breath', 'chest pain'],
                ['stress', 'headache', 'muscle tension', 'sleep problems'],
                ['depression', 'anxiety', 'fatigue', 'appetite changes'],
                
                // Digestive conditions
                ['stomach pain', 'diarrhea', 'nausea', 'vomiting'],
                ['abdominal pain', 'bloating', 'constipation', 'gas'],
                ['stomach pain', 'heartburn', 'acid reflux', 'chest pain'],
                ['diarrhea', 'fever', 'abdominal pain', 'dehydration'],
                ['nausea', 'vomiting', 'dizziness', 'fatigue'],
                
                // Musculoskeletal conditions
                ['joint pain', 'fatigue', 'morning stiffness', 'swelling'],
                ['back pain', 'muscle pain', 'limited mobility', 'fatigue'],
                ['joint pain', 'swelling', 'redness', 'warmth'],
                ['muscle pain', 'fatigue', 'weakness', 'tenderness'],
                ['back pain', 'leg pain', 'numbness', 'tingling'],
                
                // Skin conditions
                ['rash', 'itching', 'redness', 'swelling'],
                ['skin rash', 'fever', 'joint pain', 'fatigue'],
                ['itching', 'dry skin', 'redness', 'scaling'],
                ['skin rash', 'blisters', 'pain', 'itching'],
                ['skin rash', 'fever', 'sore throat', 'fatigue'],
                
                // Endocrine conditions
                ['fatigue', 'weight gain', 'cold intolerance', 'dry skin'],
                ['fatigue', 'weight loss', 'heat intolerance', 'sweating'],
                ['thirst', 'frequent urination', 'fatigue', 'blurred vision'],
                ['fatigue', 'muscle weakness', 'weight loss', 'increased appetite'],
                ['fatigue', 'weight gain', 'mood changes', 'sleep problems'],
                
                // Cardiovascular conditions
                ['chest pain', 'shortness of breath', 'fatigue', 'sweating'],
                ['chest pain', 'arm pain', 'shortness of breath', 'nausea'],
                ['shortness of breath', 'fatigue', 'swelling', 'chest pain'],
                ['irregular heartbeat', 'chest pain', 'dizziness', 'fatigue'],
                ['high blood pressure', 'headache', 'dizziness', 'chest pain'],
                
                // Additional conditions
                ['fever', 'fatigue', 'muscle pain', 'headache'],
                ['fatigue', 'sleep problems', 'mood changes', 'appetite changes'],
                ['headache', 'fever', 'muscle pain', 'fatigue'],
                ['dizziness', 'balance problems', 'hearing problems', 'tinnitus'],
                ['vision problems', 'headache', 'nausea', 'vomiting']
            ],
            conditions: [
                // Respiratory conditions
                'Common Cold',
                'Bronchitis',
                'Pneumonia',
                'Strep Throat',
                'Asthma',
                
                // Neurological conditions
                'Migraine',
                'Meningitis',
                'Vertigo',
                'Brain Tumor',
                'Alzheimer\'s Disease',
                
                // Mental health conditions
                'Anxiety Disorder',
                'Major Depressive Disorder',
                'Panic Disorder',
                'Stress Disorder',
                'Bipolar Disorder',
                
                // Digestive conditions
                'Gastritis',
                'Irritable Bowel Syndrome',
                'Gastroesophageal Reflux Disease',
                'Food Poisoning',
                'Appendicitis',
                
                // Musculoskeletal conditions
                'Rheumatoid Arthritis',
                'Osteoarthritis',
                'Fibromyalgia',
                'Gout',
                'Sciatica',
                
                // Skin conditions
                'Eczema',
                'Psoriasis',
                'Contact Dermatitis',
                'Shingles',
                'Lupus',
                
                // Endocrine conditions
                'Hypothyroidism',
                'Hyperthyroidism',
                'Diabetes',
                'Addison\'s Disease',
                'Cushing\'s Syndrome',
                
                // Cardiovascular conditions
                'Angina',
                'Heart Attack',
                'Heart Failure',
                'Arrhythmia',
                'Hypertension',
                
                // Additional conditions
                'Viral Infection',
                'Chronic Fatigue Syndrome',
                'Influenza',
                'Meniere\'s Disease',
                'Glaucoma'
            ]
        };

        // Train the model with sample data
        await symptomAnalyzer.trainModel(trainingData);
        // Convert symptoms into numbers (because neural networks work with numbers, not text) 
        mlModelAvailable = true;
        console.log('ML Model trained successfully');
    } catch (error) {
        console.error('Error initializing ML model:', error);
        mlModelAvailable = false;
        console.log('Falling back to rule-based analysis');   
    }



     // agar ml failed ho gya then prefer to this rule based conditions 
    // Enhanced symptom to condition mapping with more detailed symptoms
    const SYMPTOM_CONDITIONS = {
        // Physical symptoms
        'fever': ['Common Cold', 'Flu', 'Viral Infection', 'Bacterial Infection', 'Malaria', 'Typhoid', 'Dengue'],
        'headache': ['Migraine', 'Tension Headache', 'Sinusitis', 'Dehydration', 'Stress', 'High Blood Pressure', 'Brain Tumor', 'Meningitis'],
        'cough': ['Common Cold', 'Bronchitis', 'Allergies', 'Asthma', 'Post-nasal Drip', 'Pneumonia', 'Tuberculosis', 'Lung Cancer'],
        'fatigue': ['Anemia', 'Depression', 'Chronic Fatigue Syndrome', 'Sleep Disorders', 'Thyroid Issues', 'Diabetes', 'Heart Disease', 'Cancer'],
        'nausea': ['Food Poisoning', 'Gastritis', 'Morning Sickness', 'Motion Sickness', 'Anxiety', 'Appendicitis', 'Gallbladder Disease', 'Pancreatitis'],
        'dizziness': ['Vertigo', 'Low Blood Pressure', 'Anemia', 'Inner Ear Problems', 'Dehydration', 'Heart Problems', 'Stroke', 'Multiple Sclerosis'],
        'chest pain': ['Angina', 'Anxiety', 'Heart Attack', 'Costochondritis', 'Acid Reflux', 'Pneumonia', 'Pulmonary Embolism', 'Aortic Dissection'],
        'shortness of breath': ['Asthma', 'Anxiety', 'Allergies', 'Heart Problems', 'Lung Issues', 'Pulmonary Embolism', 'Pneumonia', 'Heart Failure'],
        'muscle pain': ['Flu', 'Fibromyalgia', 'Exercise Injury', 'Stress', 'Vitamin D Deficiency', 'Lupus', 'Rheumatoid Arthritis', 'Polymyalgia Rheumatica'],
        'sore throat': ['Common Cold', 'Strep Throat', 'Tonsillitis', 'Allergies', 'Acid Reflux', 'Mononucleosis', 'HIV', 'Throat Cancer'],
        
        // Mental health symptoms
        'stress': ['Anxiety', 'Depression', 'Burnout', 'Sleep Disorders', 'High Blood Pressure', 'Heart Disease', 'Digestive Issues', 'Immune System Problems'],
        'anxiety': ['Generalized Anxiety Disorder', 'Panic Disorder', 'Stress', 'Depression', 'PTSD', 'OCD', 'Social Anxiety', 'Phobias'],
        'depression': ['Major Depressive Disorder', 'Seasonal Affective Disorder', 'Bipolar Disorder', 'Dysthymia', 'Postpartum Depression', 'Psychotic Depression'],
        'insomnia': ['Sleep Disorders', 'Anxiety', 'Depression', 'Stress', 'Circadian Rhythm Disorders', 'Sleep Apnea', 'Restless Leg Syndrome', 'Narcolepsy'],
        
        // Digestive symptoms
        'stomach pain': ['Gastritis', 'Food Poisoning', 'Irritable Bowel Syndrome', 'Ulcer', 'Acid Reflux', 'Appendicitis', 'Gallbladder Disease', 'Pancreatitis'],
        'diarrhea': ['Food Poisoning', 'Viral Infection', 'Irritable Bowel Syndrome', 'Food Intolerance', 'Celiac Disease', 'Crohn\'s Disease', 'Ulcerative Colitis'],
        'constipation': ['Dehydration', 'Dietary Issues', 'Irritable Bowel Syndrome', 'Thyroid Problems', 'Colon Cancer', 'Hernia', 'Bowel Obstruction'],
        
        // Skin symptoms
        'rash': ['Allergic Reaction', 'Eczema', 'Contact Dermatitis', 'Viral Infection', 'Fungal Infection', 'Psoriasis', 'Lupus', 'Lyme Disease'],
        'itching': ['Allergies', 'Eczema', 'Dry Skin', 'Fungal Infection', 'Parasitic Infection', 'Liver Disease', 'Kidney Disease', 'Thyroid Problems'],
        
        // Additional symptoms
        'joint pain': ['Arthritis', 'Rheumatoid Arthritis', 'Osteoarthritis', 'Gout', 'Lupus', 'Fibromyalgia', 'Lyme Disease'],
        'back pain': ['Muscle Strain', 'Herniated Disc', 'Sciatica', 'Osteoporosis', 'Kidney Problems', 'Spinal Stenosis', 'Ankylosing Spondylitis'],
        'eye problems': ['Conjunctivitis', 'Glaucoma', 'Cataracts', 'Macular Degeneration', 'Dry Eye Syndrome', 'Retinal Detachment'],
        'ear problems': ['Ear Infection', 'Tinnitus', 'Meniere\'s Disease', 'Earwax Buildup', 'Otosclerosis', 'Acoustic Neuroma'],
        'weight loss': ['Hyperthyroidism', 'Diabetes', 'Cancer', 'Depression', 'Eating Disorders', 'Celiac Disease', 'Tuberculosis'],
        'weight gain': ['Hypothyroidism', 'Diabetes', 'Cushing\'s Syndrome', 'Polycystic Ovary Syndrome', 'Depression', 'Medication Side Effects'],
        'memory problems': ['Alzheimer\'s Disease', 'Dementia', 'Depression', 'Vitamin B12 Deficiency', 'Thyroid Problems', 'Brain Tumor'],
        'tremors': ['Essential Tremor', 'Parkinson\'s Disease', 'Multiple Sclerosis', 'Hyperthyroidism', 'Alcohol Withdrawal', 'Medication Side Effects']
    };

    // Enhanced recommendations with more detailed advice
    const RECOMMENDATIONS = {
        'Common Cold': [
            'Rest and get adequate sleep',
            'Stay hydrated with warm fluids',
            'Use over-the-counter cold medicine',
            'Try steam inhalation',
            'Consider vitamin C supplements',
            'Use saline nasal drops',
            'Gargle with warm salt water',
            'Avoid smoking and secondhand smoke'
        ],
        'Flu': [
            'Rest and get plenty of sleep',
            'Stay hydrated with water and electrolyte drinks',
            'Take antiviral medication if prescribed',
            'Use over-the-counter pain relievers',
            'Consider getting a flu shot next season',
            'Use a humidifier',
            'Take warm baths',
            'Avoid contact with others to prevent spread'
        ],
        'Viral Infection': [
            'Rest and get adequate sleep',
            'Stay hydrated',
            'Take over-the-counter pain relievers',
            'Monitor temperature',
            'Seek medical attention if symptoms worsen',
            'Use a humidifier',
            'Take warm baths',
            'Avoid contact with others'
        ],
        'Migraine': [
            'Rest in a dark, quiet room',
            'Take prescribed migraine medication',
            'Apply cold or warm compress',
            'Stay hydrated',
            'Identify and avoid triggers',
            'Practice stress management',
            'Maintain regular sleep schedule',
            'Consider preventive medication'
        ],
        'Tension Headache': [
            'Take over-the-counter pain relievers',
            'Practice stress management techniques',
            'Get adequate sleep',
            'Try gentle neck stretches',
            'Consider massage therapy',
            'Apply heat or cold packs',
            'Practice relaxation techniques',
            'Maintain good posture'
        ],
        'Anxiety': [
            'Practice deep breathing exercises',
            'Try meditation or mindfulness',
            'Consider therapy or counseling',
            'Regular exercise',
            'Limit caffeine and alcohol',
            'Maintain a regular sleep schedule',
            'Practice progressive muscle relaxation',
            'Consider medication if prescribed'
        ],
        'Depression': [
            'Seek professional help',
            'Practice self-care routines',
            'Consider therapy or counseling',
            'Regular exercise',
            'Maintain a healthy sleep schedule',
            'Connect with friends and family',
            'Consider medication if prescribed',
            'Practice mindfulness and meditation'
        ],
        'Stress': [
            'Practice stress management techniques',
            'Regular exercise',
            'Get adequate sleep',
            'Consider meditation or yoga',
            'Take regular breaks from work',
            'Maintain a healthy diet',
            'Practice time management',
            'Consider professional help if needed'
        ],
        'Sleep Disorders': [
            'Maintain a regular sleep schedule',
            'Create a relaxing bedtime routine',
            'Limit screen time before bed',
            'Keep bedroom cool and dark',
            'Consider consulting a sleep specialist',
            'Avoid caffeine and alcohol',
            'Exercise regularly but not before bed',
            'Consider cognitive behavioral therapy'
        ],
        'High Blood Pressure': [
            'Reduce salt intake',
            'Exercise regularly',
            'Maintain a healthy weight',
            'Limit alcohol consumption',
            'Quit smoking',
            'Take prescribed medication',
            'Monitor blood pressure regularly',
            'Practice stress management'
        ],
        'Diabetes': [
            'Monitor blood sugar levels',
            'Follow a balanced diet',
            'Exercise regularly',
            'Take prescribed medication',
            'Maintain a healthy weight',
            'Regular check-ups with doctor',
            'Monitor for complications',
            'Stay hydrated'
        ],
        'Heart Disease': [
            'Follow a heart-healthy diet',
            'Exercise regularly',
            'Quit smoking',
            'Limit alcohol consumption',
            'Take prescribed medication',
            'Monitor blood pressure',
            'Manage stress',
            'Regular check-ups with cardiologist'
        ],
        'Asthma': [
            'Use prescribed inhalers',
            'Avoid triggers',
            'Monitor peak flow',
            'Create an asthma action plan',
            'Regular check-ups with doctor',
            'Consider allergy testing',
            'Maintain clean living environment',
            'Exercise with caution'
        ],
        'Arthritis': [
            'Exercise regularly',
            'Maintain a healthy weight',
            'Use heat and cold therapy',
            'Take prescribed medication',
            'Consider physical therapy',
            'Use assistive devices if needed',
            'Practice joint protection',
            'Consider dietary changes'
        ],
        'Thyroid Issues': [
            'Take prescribed medication',
            'Regular blood tests',
            'Maintain a balanced diet',
            'Exercise regularly',
            'Monitor symptoms',
            'Regular check-ups with endocrinologist',
            'Consider dietary supplements',
            'Manage stress levels'
        ]
    };

    // Function to extract symptoms from natural language input
    function extractSymptoms(text) {
        try {  
            const symptoms = new Set();
            const words = text.toLowerCase().split(/\s+/); 
             /* 
             1. Input Parsing
            The function takes in a text (e.g., "I feel tired and have a headache").

It converts the text to lowercase to make it case-insensitive. This ensures that "Headache", "headache", or "HEADACHE" are all treated the same.

2. Splitting the Text
The text is split into individual words using .split(/\s+/). This breaks the sentence into an array of words like ["i", "feel", "tired", "and", "have", "a", "headache"].

3. Symptom Mapping
It defines a set of symptom patterns in a symptomPatterns object. These patterns contain:

Keywords (e.g., "pain", "fever", "dizzy") that can appear in sentences.

Associated symptoms (e.g., "joint pain", "headache", "fever").

The function looks for words in the input text that match the keys in symptomPatterns.
             
 */
            // Enhanced symptom mapping with more natural language variations
            const symptomPatterns = {
                // Physical symptoms
                'pain': ['muscle pain', 'joint pain', 'back pain', 'stomach pain', 'chest pain', 'headache'],
                'ache': ['headache', 'stomach ache', 'backache', 'joint ache'],
                'hurt': ['muscle pain', 'joint pain', 'back pain', 'stomach pain', 'chest pain', 'headache'],
                'sore': ['muscle pain', 'joint pain', 'back pain', 'stomach pain', 'chest pain', 'headache'],
                'tired': ['fatigue'],
                'exhausted': ['fatigue'],
                'weak': ['fatigue'],
                'fever': ['fever'],
                'hot': ['fever'],
                'cold': ['chills'],
                'cough': ['cough'],
                'sneeze': ['cough'],
                'runny nose': ['cough'],
                'stuffy nose': ['cough'],
                'wheezing': ['wheezing'],
                'whistling sound': ['wheezing'],
                'breathing difficulty': ['shortness of breath', 'wheezing'],
                'tight chest': ['chest tightness', 'shortness of breath'],
                'chest tightness': ['chest tightness', 'shortness of breath'],
                'nausea': ['nausea'],
                'vomit': ['nausea'],
                'dizzy': ['dizziness'],
                'lightheaded': ['dizziness'],
                'short of breath': ['shortness of breath'],
                'can\'t breathe': ['shortness of breath'],
                'difficulty breathing': ['shortness of breath'],
                
                // Mental health symptoms
                'depressed': ['depression'],
                'sad': ['depression'],
                'unhappy': ['depression'],
                'down': ['depression'],
                'blue': ['depression'],
                'anxious': ['anxiety'],
                'worried': ['anxiety'],
                'nervous': ['anxiety'],
                'stressed': ['stress'],
                'overwhelmed': ['stress'],
                'can\'t sleep': ['insomnia'],
                'trouble sleeping': ['insomnia'],
                'insomnia': ['insomnia'],
                'panic': ['panic attacks'],
                'panic attack': ['panic attacks'],
                'loss of interest': ['depression'],
                'mood changes': ['depression', 'bipolar disorder'],
                'personality changes': ['alzheimer\'s disease'],
                
                // Digestive symptoms
                'stomach': ['stomach pain'],
                'belly': ['stomach pain'],
                'abdomen': ['stomach pain'],
                'diarrhea': ['diarrhea'],
                'constipation': ['constipation'],
                'bloating': ['bloating'],
                'gas': ['bloating'],
                'heartburn': ['heartburn'],
                'acid reflux': ['acid reflux'],
                'dehydration': ['dehydration'],
                
                // Skin symptoms
                'rash': ['rash'],
                'itchy': ['itching'],
                'itch': ['itching'],
                'hives': ['rash'],
                'dry skin': ['dry skin'],
                'scaling': ['scaling'],
                'blisters': ['blisters'],
                'redness': ['redness'],
                'swelling': ['swelling'],
                
                // Musculoskeletal symptoms
                'joint': ['joint pain'],
                'back': ['back pain'],
                'morning stiffness': ['morning stiffness'],
                'limited mobility': ['limited mobility'],
                'tenderness': ['tenderness'],
                'leg pain': ['leg pain'],
                'numbness': ['numbness'],
                'tingling': ['tingling'],
                
                // Endocrine symptoms
                'weight gain': ['weight gain'],
                'weight loss': ['weight loss'],
                'cold intolerance': ['cold intolerance'],
                'heat intolerance': ['heat intolerance'],
                'sweating': ['sweating'],
                'thirst': ['thirst'],
                'frequent urination': ['frequent urination'],
                'blurred vision': ['blurred vision'],
                'increased appetite': ['increased appetite'],
                
                // Cardiovascular symptoms
                'high blood pressure': ['high blood pressure'],
                'hypertension': ['high blood pressure'],
                'irregular heartbeat': ['irregular heartbeat'],
                'arrhythmia': ['irregular heartbeat'],
                'arm pain': ['arm pain'],
                'swelling': ['swelling'],
                
                // Neurological symptoms
                'sensitivity to light': ['sensitivity to light'],
                'stiff neck': ['stiff neck'],
                'confusion': ['confusion'],
                'memory problems': ['memory problems'],
                'difficulty speaking': ['difficulty speaking'],
                'balance problems': ['balance problems'],
                'hearing problems': ['hearing problems'],
                'tinnitus': ['tinnitus'],
                'vision problems': ['vision problems'],
                
                // Additional symptoms
                'eye': ['eye problems'],
                'ear': ['ear problems'],
                'weight': ['weight loss', 'weight gain'],
                'memory': ['memory problems'],
                'forgetful': ['memory problems'],
                'tremor': ['tremors'],
                'shaking': ['tremors'],
                'swollen lymph nodes': ['swollen lymph nodes'],
                'body aches': ['body aches']
            };
            


            /* The function first checks if any exact symptom matches are present in the text (using SYMPTOM_CONDITIONS).

Then, it checks for pattern matches (using symptomPatterns), where certain patterns in the text trigger multiple related symptoms.*/
            // Check for exact matches first
            for (const [symptom, conditions] of Object.entries(SYMPTOM_CONDITIONS)) {
                if (text.toLowerCase().includes(symptom)) {
                    symptoms.add(symptom);
                }
            }
            
            // Check for pattern matches
            for (const [pattern, symptomList] of Object.entries(symptomPatterns)) {
                if (text.toLowerCase().includes(pattern)) {
                    symptomList.forEach(symptom => symptoms.add(symptom));
                }
            }




            
            // Check for body part mentions with pain
            const bodyParts = ['head', 'neck', 'shoulder', 'arm', 'hand', 'chest', 'back', 'stomach', 'leg', 'foot', 'eye', 'ear', 'nose', 'throat'];
            for (const part of bodyParts) {
                if (text.toLowerCase().includes(part) && 
                    (text.toLowerCase().includes('pain') || 
                     text.toLowerCase().includes('ache') || 
                     text.toLowerCase().includes('hurt') || 
                     text.toLowerCase().includes('sore'))) {
                    symptoms.add(`${part} pain`);
                }
            }
            
            return Array.from(symptoms);
        } catch (error) {
            console.error('Error extracting symptoms:', error);
            throw error;
        }
    }       

    function analyzeSymptomsRuleBased(symptoms, duration, habits) {
        const possibleConditions = new Set();
        const recommendations = new Set();
        const conditionScores = new Map(); // Track relevance scores for conditions
        
        // Analyze symptoms with scoring
        for (const symptom of symptoms) {
            const symptomLower = symptom.toLowerCase();
            if (SYMPTOM_CONDITIONS[symptomLower]) {
                SYMPTOM_CONDITIONS[symptomLower].forEach(condition => {
                    possibleConditions.add(condition);
                    // Increment score for each matching symptom
                    conditionScores.set(condition, (conditionScores.get(condition) || 0) + 1);
                });
            }
        }
        
        // Add conditions based on duration with scoring
        if (duration === 'more_than_2_weeks') {
            possibleConditions.add('Chronic Condition');
            conditionScores.set('Chronic Condition', 2);
        }
        
        // Add conditions based on habits with scoring
        if (habits.includes('smoking')) {
            possibleConditions.add('Respiratory Issues');
            conditionScores.set('Respiratory Issues', 2);
        }
        if (habits.includes('alcohol')) {
            possibleConditions.add('Liver Issues');
            conditionScores.set('Liver Issues', 2);
        }
        if (habits.includes('stress')) {
            possibleConditions.add('Anxiety');
            possibleConditions.add('High Blood Pressure');
            conditionScores.set('Anxiety', 2);
            conditionScores.set('High Blood Pressure', 2);
        }
        if (habits.includes('sleep')) {
            possibleConditions.add('Sleep Disorders');
            conditionScores.set('Sleep Disorders', 2);
        }
        if (habits.includes('diet')) {
            possibleConditions.add('Nutritional Deficiencies');
            conditionScores.set('Nutritional Deficiencies', 2);
        }

        // Sort conditions by relevance score
        const sortedConditions = Array.from(possibleConditions)
            .sort((a, b) => (conditionScores.get(b) || 0) - (conditionScores.get(a) || 0))
            .slice(0, 5); // Keep only top 5 most relevant conditions
        
        // Generate recommendations based on top conditions
        const primaryRecommendations = new Set();
        const secondaryRecommendations = new Set();
        
        for (const condition of sortedConditions) {
            if (RECOMMENDATIONS[condition]) {
                // Add first 2 recommendations as primary
                RECOMMENDATIONS[condition].slice(0, 2).forEach(rec => primaryRecommendations.add(rec));
                // Add remaining as secondary
                RECOMMENDATIONS[condition].slice(2).forEach(rec => secondaryRecommendations.add(rec));
            }
        }
        
        // Add lifestyle recommendations based on habits
        if (habits.includes('smoking')) {
            primaryRecommendations.add('Consider quitting smoking');
        }
        if (habits.includes('alcohol')) {
            primaryRecommendations.add('Limit alcohol consumption');
        }
        if (habits.includes('exercise')) {
            primaryRecommendations.add('Maintain your exercise routine');
        } else {
            primaryRecommendations.add('Start a regular exercise routine');
        }
        if (habits.includes('stress')) {
            primaryRecommendations.add('Practice stress management techniques');
        }
        if (habits.includes('sleep')) {
            primaryRecommendations.add('Improve sleep hygiene');
        }
        if (habits.includes('diet')) {
            primaryRecommendations.add('Adopt a balanced diet');
        }
        
        return {
            possible_conditions: sortedConditions,
            primary_recommendations: Array.from(primaryRecommendations),
            secondary_recommendations: Array.from(secondaryRecommendations)
        };
    }

    function calculateSeverity(symptoms, duration, habits) {
        try {
            let severity = 0;
            
            // Base severity from number of symptoms
            severity += symptoms.length * 10;
            
            // Duration impact
            switch(duration) {
                case 'less_than_day':
                    severity += 10;   
                    break;
                case '1_3_days':
                    severity += 20;
                    break;
                case '4_7_days':
                    severity += 30;
                    break;
                case '1_2_weeks':
                    severity += 40;
                    break;
                case 'more_than_2_weeks':
                    severity += 50;
                    break;
            }
            
            // Habits impact
            if (habits.includes('smoking')) severity += 15;   
            if (habits.includes('alcohol')) severity += 15;
            if (habits.includes('stress')) severity += 20;
            if (habits.includes('sleep')) severity += 20;
            if (habits.includes('diet')) severity += 15;
            
            // Normalize severity to 0-100
            severity = Math.min(100, severity);
            
            return severity;
        } catch (error) {
            console.error('Error calculating severity:', error);
            return 50; // Default to moderate severity
        }
    }

    function getSeverityText(severity) {
        if (severity < 30) return 'Mild - Monitor symptoms and follow recommendations';
        if (severity < 60) return 'Moderate - Consider consulting a healthcare provider';
        return 'Severe - Seek medical attention as soon as possible';
    }

    analyzeBtn.addEventListener('click', async () => {
        const inputText = symptomsInput.value.trim();
        const duration = durationSelect.value;
        const habits = Array.from(document.querySelectorAll('input[name="habits"]:checked')).map(cb => cb.id);
        
        if (!inputText) {
            alert('Please describe your symptoms');
            return;
        }
        
        if (!duration) {
            alert('Please select how long you have been experiencing these symptoms');
            return;
        }

        // Show loading state
        loadingDiv.style.display = 'block';
        resultsContent.style.display = 'none';
        conditionsList.innerHTML = '';
        recommendationsList.innerHTML = '';

        try {
            // Extract symptoms from natural language input
            const extractedSymptoms = extractSymptoms(inputText);
            
            if (extractedSymptoms.length === 0) {
                alert('Could not identify specific symptoms. Please try describing your symptoms in more detail.');
                loadingDiv.style.display = 'none';
                return;
            }

            let results;
            let mlPredictions = null;

            if (mlModelAvailable && symptomAnalyzer && symptomAnalyzer.isModelLoaded) {
                try {
                    // Get ML model predictions
                    mlPredictions = await symptomAnalyzer.analyzeSymptoms(extractedSymptoms);
                    
                    // Combine ML predictions with rule-based analysis
                    results = {
                        possible_conditions: mlPredictions.map(p => p.condition),
                        primary_recommendations: [],
                        secondary_recommendations: []
                    };
                } catch (error) {
                    console.error('Error with ML model, falling back to rule-based analysis:', error);
                    results = analyzeSymptomsRuleBased(extractedSymptoms, duration, habits);
                }
            } else {
                // Use rule-based analysis
                results = analyzeSymptomsRuleBased(extractedSymptoms, duration, habits);
            }

            // Calculate severity
            const severity = calculateSeverity(extractedSymptoms, duration, habits);

            // Display results
            results.possible_conditions.forEach((condition, index) => {
                const li = document.createElement('li');
                if (mlPredictions) {
                    const probability = mlPredictions[index].probability;
                    li.textContent = `${condition} (${(probability * 100).toFixed(1)}% confidence)`;
                } else {
                    li.textContent = condition;
                }
                conditionsList.appendChild(li);
            });

            // Display primary recommendations
            const primaryRecsHeader = document.createElement('h4');
            primaryRecsHeader.textContent = 'Primary Recommendations';
            recommendationsList.appendChild(primaryRecsHeader);

            results.primary_recommendations.forEach(recommendation => {
                const li = document.createElement('li');
                li.textContent = recommendation;
                recommendationsList.appendChild(li);
            });

            // Display secondary recommendations if any
            if (results.secondary_recommendations.length > 0) {
                const secondaryRecsHeader = document.createElement('h4');
                secondaryRecsHeader.textContent = 'Additional Recommendations';
                recommendationsList.appendChild(secondaryRecsHeader);

                results.secondary_recommendations.forEach(recommendation => {
                    const li = document.createElement('li');
                    li.textContent = recommendation;
                    recommendationsList.appendChild(li);
                });
            }

            // Update severity indicator
            severityBar.style.width = `${severity}%`;
            severityText.textContent = getSeverityText(severity);

            // Hide loading and show results
            loadingDiv.style.display = 'none';
            resultsContent.style.display = 'block';

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while analyzing symptoms. Please try again.');
            loadingDiv.style.display = 'none';
        }
    });
}); 