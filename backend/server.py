from flask import Flask, request, jsonify, render_template
import json
import mysql.connector
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from flask_cors import CORS  # Import ekstensi CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})   # Aktifkan CORS untuk aplikasi Flask

# Konfigurasi koneksi database MySQL
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'sarima',
}

# Fungsi untuk memeriksa stationeritas
def check_stationarity(data):
    # Implementasi logika pemeriksaan stationeritas di sini (menggunakan uji ADF atau metode lainnya)
    # Contoh:
    # ...
    return True  # Dummy value, ubah sesuai kebutuhan

# Fungsi untuk menyimpan data ke database
@app.route('/save_data', methods=['POST'])
def save_to_database():
    try:
        # Menerima data dari formulir
        data = request.json
        month = data.get('month')
        sales = data.get('sales')

        # Menyimpan data ke database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        query = "INSERT INTO monthly_sales (month, sales) VALUES (%s, %s)"
        cursor.execute(query, (month, sales))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Data saved successfully'})
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Failed to save data'}), 500


# Fungsi untuk mengambil data dari database
def get_data_from_database():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Mengambil data dari database
        query = "SELECT * FROM monthly_sales"
        cursor.execute(query)
        data = cursor.fetchall()

        cursor.close()
        conn.close()

        return data
    except Exception as e:
        print("Error:", e)
        return []

# Fungsi untuk membuat plot dan mengembalikan data gambar dalam bentuk base64
def create_plot(months, sales, title):
    plt.figure(figsize=(10, 5))
    plt.plot(months, sales, marker='o')
    plt.title(title)
    plt.xlabel('Month')
    plt.ylabel('Sales')
    plt.grid(True)
    
    # Simpan plot ke BytesIO
    image_stream = BytesIO()
    plt.savefig(image_stream, format='png')
    image_stream.seek(0)
    
    # Ubah ke base64
    base64_image = base64.b64encode(image_stream.read()).decode('utf-8')
    
    plt.close()
    
    return base64_image

@app.route('/check_stationarity', methods=['POST'])
def handle_check_stationarity():
    try:
        request_data = request.get_json()
        monthly_sales_data = request_data.get('monthlySales', [])

        if not isinstance(monthly_sales_data, list) or not all(
                isinstance(entry, dict) and 'month' in entry and 'sales' in entry for entry in monthly_sales_data):
            return jsonify({'error': 'Invalid format for monthlySales data'}), 400

        sales_values = [entry['sales'] for entry in monthly_sales_data]
        is_stationary = check_stationarity(sales_values)
        is_stationary_str = str(is_stationary)

        # Menyimpan data ke database
        for entry in monthly_sales_data:
            save_to_database(entry['month'], entry['sales'])

        return jsonify({'isStationary': is_stationary_str})
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format'}), 400

# Menampilkan tabel data dalam bentuk HTML
@app.route('/show_data')
def show_data():
    data = get_data_from_database()
    return jsonify(data)

# Menangani permintaan plotting
@app.route('/plot', methods=['POST'])
def plot():
    try:
        # Mendapatkan input untuk plotting dari formulir
        selected_id = request.form.get('selectedId')

        # Mendapatkan data dari database
        data = get_data_from_database()

        # Memfilter data berdasarkan id yang dipilih
        selected_data = next((entry for entry in data if str(entry['id']) == selected_id), None)

        if not selected_data:
            return jsonify({'error': 'Selected data not found'}), 400

        # Membuat plot dan mendapatkan gambar dalam base64
        base64_image = create_plot([entry['month'] for entry in data], [entry['sales'] for entry in data], 'Monthly Sales Plot')

        return jsonify({'base64Image': base64_image})
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Error processing plot request'}), 500

if __name__ == '__main__':
    app.run(debug=True)
