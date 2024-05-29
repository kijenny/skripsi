@app.route('/api/plot', methods=['POST'])
def plot_data():
    try:
        # Menerima file Excel dari frontend
        excel_file = request.files['file']
        steps=int(request.form['steps'])
        df = pd.read_excel(excel_file)

        # Konversi kolom 'Date' ke format datetime
        df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%Y')

        # Fit SARIMA model
        sales_series = pd.Series(df['Total Sales'].values, index=pd.to_datetime(df['Date'], format='%m/%d/%Y'))
        sales_series = sales_series.asfreq('MS')

        sarima_model = fit_sarima(sales_series, steps)
        last_year = df['Date'].max().year
        print(f'Last year: {sarima_model}')

        # Check stationarity and get stationarity plot
        stationarity_image = check_stationarity(sales_series)

        # Buat indeks untuk prediksi 12 bulan ke depan
        forecast_index = pd.date_range(start=f'{last_year + 1}-01-01', periods=steps, freq='M')
        print(f'Token generated for user {forecast_index}')

        # Buat deret waktu baru dengan indeks yang baru
        forecast_series = pd.Series(index=forecast_index)

        # Gabungkan deret waktu dari data dan deret waktu untuk prediksi
        sales_series = pd.concat([sales_series, forecast_series])

        # Set jumlah langkah (steps) sesuai kebutuhan
        # forecast_steps = 12
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

        # Generate bar plot and get base64 image
        # base64_image = generate_bar_plot(labels, values)

        # Mengirim data sebagai JSON
        data = {
            'labels': labels.tolist(),
            'values': values,
            # 'base64Image': base64_image,
            'sarimaForecast': sarima_forecast.tolist(),  # Menambahkan hasil prediksi SARIMA
            'komoditas': komoditas,
            'stationarityImage': stationarity_image  # Menambahkan base64 image dari grafik stasioneritas
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)})