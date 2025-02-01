# ReceiptStorer 

## 📌 Description
**ReceiptStorer** is the ultimate site for managing personal expenses!
With artificial intelligence, the system automatically extracts data from receipts and organizes them into a clear and detailed dashboard.
With an intuitive interface and beautifull graphs you can see your monthly expence. divided form week or from single dai

## 🚀 Key Features
- **Powerful Flask Backend**: A Flask API based that call the ai apps to extract data
- ** AI for Data Recognition**: Extract automatically data form the receipt image
- **Image Upload**: Simply take a picture of a receipt to retrieve all the details in seconds
- **Smart Expense Management**:
	- Monthly expense analysis with weekly and daily breakdowns
	- Interactive charts for visual monitoring
- **Transaction History**: Keep track of your most recent expenses at all times

## 🛠️ Technologies Used
- **Python** with **Flask** for the backend
- **Pandas** for data management and analysis
- **MySQL** for reliable and scalable data storage
- **Html/Css/Javascript** for the front-end site and graphs

## 🏗️ Installation
### Prerequisites
- Python with virtualenv for virtual environment management
- A configured MySQL server

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/Giacomo-Marconi/receiptStorer
   cd receiptstorer/api
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   
4. Configure the MySQL database:
   - Table configuration on db.py
   
5. Start the application:
   ```sh
   python app.py
   ```

## 📊 Usage
1. Upload a receipt image with a simple click
2. Let our AI automatically extract the data
3. Confirm or modify the data extracted
4. Explore detailed statistics about your expenses and check transaction history

