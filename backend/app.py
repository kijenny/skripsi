from flask import Flask, jsonify, request, after_this_request
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from flask_cors import CORS
from datetime import timedelta
from pmdarima import auto_arima
import pandas as pd
import matplotlib
matplotlib.use('Agg')  
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import statsmodels.api as sm
from statsmodels.tsa.statespace.sarimax import SARIMAX

app = Flask(__name__)
CORS(app)
auth = HTTPBasicAuth()

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/sarima'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    total_sales = db.Column(db.Float, nullable=False)
    komoditi = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<Sale {self.id}>"
# Model User untuk menyimpan informasi username dan password
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(10), nullable=False)

class ForecastResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    predicted_sales = db.Column(db.Float, nullable=False)
    komoditi = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<ForecastResult {self.id}>"


# Decorator untuk memerlukan otentikasi pada route tertentu
@auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        return username

@app.route('/api/sales', methods=['POST'])
def create_sale():
    try:
        data = request.get_json()
        new_sale = Sale(date=data['date'], total_sales=data['total_sales'], komoditi=data['komoditi'])
        db.session.add(new_sale)
        db.session.commit()
        return jsonify({'message': 'Sale created successfully', 'id': new_sale.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/sales/<int:sale_id>', methods=['PUT'])
def update_sale(sale_id):
    sale = Sale.query.get_or_404(sale_id)
    data = request.get_json()
    
    sale.date = data.get('date', sale.date)
    sale.total_sales = data.get('total_sales', sale.total_sales)
    sale.komoditi = data.get('komoditi', sale.komoditi)
    
    db.session.commit()
    return jsonify({'message': 'Sale updated successfully'}), 200

@app.route('/api/forecasts', methods=['POST'])
def create_forecast_result():
    try:
        data = request.get_json()
        new_forecast = ForecastResult(date=data['date'], predicted_sales=data['predicted_sales'], komoditi=data['komoditi'])
        db.session.add(new_forecast)
        db.session.commit()
        return jsonify({'message': 'ForecastResult created successfully', 'id': new_forecast.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/forecasts/<int:forecast_id>', methods=['PUT'])
def update_forecast_result(forecast_id):
    forecast = ForecastResult.query.get_or_404(forecast_id)
    data = request.get_json()
    
    forecast.date = data.get('date', forecast.date)
    forecast.predicted_sales = data.get('predicted_sales', forecast.predicted_sales)
    forecast.komoditi = data.get('komoditi', forecast.komoditi)
    
    db.session.commit()
    return jsonify({'message': 'ForecastResult updated successfully'}), 200

@app.route('/api/sales/<int:sale_id>', methods=['DELETE'])
def delete_sale(sale_id):
    sale = Sale.query.get_or_404(sale_id)
    try:
        db.session.delete(sale)
        db.session.commit()
        return jsonify({'message': 'Sale deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/forecasts/<int:forecast_id>', methods=['DELETE'])
def delete_forecast_result(forecast_id):
    forecast = ForecastResult.query.get_or_404(forecast_id)
    try:
        db.session.delete(forecast)
        db.session.commit()
        return jsonify({'message': 'ForecastResult deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def check_stationarity(series):
    # Uji stasioneritas menggunakan Augmented Dickey-Fuller Test
    adf_result = sm.tsa.adfuller(series)

    # Output hasil uji stasioneritas
    print("ADF Statistic:", adf_result[0])
    print("p-value:", adf_result[1])
    print("Critical Values:")
    for key, value in adf_result[4].items():
        print(f"\t{key}: {value}")

    # Plot data
    plt.figure(figsize=(10, 6))
    plt.plot(series)
    plt.title('Time Series Data')
    plt.xlabel('Date')
    plt.ylabel('Total Sales')
    plt.grid(True)

    # Save the plot to a BytesIO object
    image_stream = BytesIO()
    plt.savefig(image_stream, format='png')
    image_stream.seek(0)

    # Convert the image to base64 for embedding in the JSON response
    base64_image = base64.b64encode(image_stream.read()).decode('utf-8')
    
    plt.close()  # Close the plot to release resources

    return base64_image

@app.route('/api/check_stationarity', methods=['POST'])
def check_stationarity_api():
    try:
        # Menerima file Excel dari frontend
        excel_file = request.files['file']
        df = pd.read_excel(excel_file)

        # Konversi kolom 'Date' ke format datetime
        df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%Y')

        # Ambil data penjualan
        sales_series = pd.Series(df['Total Sales'].values, index=pd.to_datetime(df['Date'], format='%m/%d/%Y'))
        sales_series = sales_series.asfreq('MS')

        # Check stationarity and get stationarity plot
        stationarity_image = check_stationarity(sales_series)

        @after_this_request
        def add_header(response):
            response.headers['Content-Type'] = 'application/json'
            return response

        return jsonify({'stationarityImage': stationarity_image})
    except Exception as e:
        return jsonify({'error': str(e)})



def fit_sarima(series, steps, order_p, order_d, order_q, seasonal_order_p, seasonal_order_d, seasonal_order_q):
    # Uji stationeritas menggunakan Augmented Dickey-Fuller Test
    adf_result = sm.tsa.adfuller(series)
    
    # Hentikan differencing jika data sudah cukup stationer
    if adf_result[1] > 0.05:
        # Lakukan differencing hanya sekali
        series = series.diff().dropna()

    # Tambahkan penentuan order secara otomatis
    model = SARIMAX(series, order=(order_p, order_d, order_q), seasonal_order=(seasonal_order_p, seasonal_order_d, seasonal_order_q, steps))
    result = model.fit()
    # print(f'Last year: {result.summary()}')
    
    return result


def forecast_sarima(model, steps):
    # Fungsi ini mengembalikan prediksi dari model SARIMA
    forecast = model.get_forecast(steps=steps)
    forecast_mean = forecast.predicted_mean
    return forecast_mean

def save_data_to_database(df, sarima_forecast):
    try:
        # Get the latest year from the 'Date' column in the DataFrame
        latest_year = df['Date'].max().year

        # Buat indeks untuk prediksi 12 bulan ke depan
        forecast_index = pd.date_range(start=f'{latest_year + 1}-01-01', periods=100, freq='M')

        # Loop through each row in the DataFrame and insert into the database
        for index, row in df.iterrows():
            new_sale = Sale(
                date=row['Date'],
                total_sales=row['Total Sales'],
                komoditi=row['Komoditi']
                # Add other columns as needed
            )
            db.session.add(new_sale)

            # Check if index is within the range of forecast_results
            if index < len(sarima_forecast) and pd.notna(sarima_forecast[index]):
                # Access the corresponding date from forecast_index
                forecast_date = forecast_index[index]

                # Add the forecasted sales and the corresponding date to the database
                new_forecast = ForecastResult(
                    date=forecast_date,
                    predicted_sales=sarima_forecast[index],
                    komoditi=row['Komoditi']
                    # Add other columns as needed
                )
                db.session.add(new_forecast)

        # Commit changes to the database
        db.session.commit()
        return True
    except Exception as e:
        # If an error occurs, rollback changes and raise the exception
        db.session.rollback()
        raise e


valid_tokens = set()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.password == password:
        token = '051001ASH100150'  # Gantilah dengan logika penghasilan token sesuai kebutuhan
        print(f'Token generated for user {username}: {token}')
        
        # Tambahkan token ke daftar token yang berlaku
        valid_tokens.add(token)

        return jsonify({'message': 'Login successful', 'token': token})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization')
    
    if token in valid_tokens:
        # Hapus token dari daftar token yang berlaku
        # valid_tokens.remove(token)
        # Berikan respons kepada klien untuk menghapus token dari local storage
        response = jsonify({'message': 'Logout successful'})
        response.delete_cookie('token')  # Hapus token dari cookie jika disimpan di sana
        return response
    else:
        return jsonify({'error': 'Invalid token'}), 401

@app.route('/api/plot', methods=['POST'])
def plot_data():
    try:
        # Menerima file Excel dari frontend
        excel_file = request.files['file']
        steps = int(request.form['steps'])
        order_p = int(request.form['order_p'])
        order_d = int(request.form['order_d'])
        order_q = int(request.form['order_q'])
        seasonal_order_p = int(request.form['seasonal_order_p'])
        seasonal_order_d = int(request.form['seasonal_order_d'])
        seasonal_order_q = int(request.form['seasonal_order_q'])

        df = pd.read_excel(excel_file)

        # Konversi kolom 'Date' ke format datetime
        df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%Y')

        # Fit SARIMA model
        sales_series = pd.Series(df['Total Sales'].values, index=pd.to_datetime(df['Date'], format='%m/%d/%Y'))
        sales_series = sales_series.asfreq('MS')

        sarima_model = fit_sarima(sales_series, steps, order_p, order_d, order_q, seasonal_order_p, seasonal_order_d, seasonal_order_q)
        last_year = df['Date'].max().year
        print(f'Last year: {sarima_model}')

        # Buat indeks untuk prediksi 12 bulan ke depan
        forecast_index = pd.date_range(start=f'{last_year + 1}-01-01', periods=steps, freq='M')
        print(f'Token generated for user {forecast_index}')

        # Buat deret waktu baru dengan indeks yang baru
        forecast_series = pd.Series(index=forecast_index)

        # Gabungkan deret waktu dari data dan deret waktu untuk prediksi
        sales_series = pd.concat([sales_series, forecast_series])

        # Set jumlah langkah (steps) sesuai kebutuhan
        sarima_forecast = forecast_sarima(sarima_model, steps)
        print(f'Token generated for user {sarima_forecast}')

        # Save data to the database, including forecast results
        save_result = save_data_to_database(df, sarima_forecast)

        if not save_result:
            return jsonify({'error': 'Failed to save data to the database'})

        # Menghitung jumlah penjualan per bulan
        result = df.groupby(pd.Grouper(key='Date', freq='M')).sum().reset_index()

        # Extract 'Month' and 'Year' from the 'Date'
        result['Month'] = result['Date'].dt.month
        result['Year'] = result['Date'].dt.year

        # Convert the Series to lists
        labels = result['Month'].astype(str) + ' ' + result['Year'].astype(str)
        values = result['Total Sales'].tolist()
        komoditas = result['Komoditi'].tolist()

        # Mengirim data sebagai JSON
        data = {
            'labels': labels.tolist(),
            'values': values,
            'sarimaForecast': sarima_forecast.tolist(),  # Menambahkan hasil prediksi SARIMA
            'komoditas': komoditas,
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)})

    
@app.route('/api/get_data', methods=['GET'])
def get_data():
    try:
        # Ambil semua data dari tabel Sale
        sales = Sale.query.all()

        predict = ForecastResult.query.all()

        # Konversi data ke format yang dapat dijadikan JSON
        data = [{'id': sale.id, 'date': sale.date.strftime('%Y-%m-%d'), 'total_sales': sale.total_sales, 'komoditi': sale.komoditi} for sale in sales]
        forecast_data = [{'id': forecast_result.id, 'date': forecast_result.date.strftime('%Y-%m-%d'), 'predicted_sales': forecast_result.predicted_sales, 'komoditi': forecast_result.komoditi} for forecast_result in predict]

        alldata = {
            'sales_data': data,
            'forecast_data': forecast_data
        }

        return jsonify({'alldata': alldata})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
