from flask import Flask, request, jsonify
import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle
import os

app = Flask(__name__)

# Route to train the model
@app.route('/train', methods=['POST'])
def train():
    try:
        data = request.get_json()
        df = pd.DataFrame(data)
        X = pd.to_datetime(df['date']).astype(int).values.reshape(-1, 1) // 10**9
        y = df['sales'].values

        model = LinearRegression()
        model.fit(X, y)

        model_path = 'sales_model.pkl'
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)

        return jsonify({'message': 'Model trained successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to make predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        dates = pd.to_datetime(data['dates']).astype(int).values.reshape(-1, 1) // 10**9

        model_path = 'sales_model.pkl'
        if not os.path.exists(model_path):
            return jsonify({'error': 'Model not found!'}), 400

        with open(model_path, 'rb') as f:
            model = pickle.load(f)

        predictions = model.predict(dates)

        return jsonify({'predictions': predictions.tolist()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
