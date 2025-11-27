# QueryGenie

QueryGenie is a FastAPI web app that allows querying an SQLite database using natural language. It uses **Ollama** as the default LLM for SQL generation, with optional OpenAI support if an API key is provided.

---

## Features

- Query SQLite databases using natural language questions  
- Dynamic schema generation from the database  
- LLM-powered SQL generation (Ollama by default)  
- Optional OpenAI backend if `OPENAI_API_KEY` is set  
- Swagger UI (`/docs`) and ReDoc (`/redoc`) with **custom browser tab titles**  
- Default question in the UI can be customized via `static.html`  
- SQL validation against the database schema to prevent errors  
- Uses **Chinook SQLite database** for testing

---

## Getting Started

### 1. Clone the repository

```bash
git clone query_genie
cd query_genie
```

### 2. Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# or
.\.venv\Scripts\activate   # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

## Running the App

```bash
python3 -m uvicorn app.main:app --reload
```

- Open [http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI  
- Open [http://localhost:8000/redoc](http://localhost:8000/redoc) for ReDoc

---

## LLM Backend

- **Default:** Ollama (`ollama sqlcoder`)  
- **Optional:** OpenAI  
  - Set your API key:

```bash
export OPENAI_API_KEY="your-openai-key"  # Linux/Mac
setx OPENAI_API_KEY "your-openai-key"    # Windows
```

---

## Database

- Uses **Chinook SQLite database** (`app/chinook.db`) included in the repo  
- Dynamic schema is automatically generated for SQL validation  
- SQL queries are validated against the schema to prevent invalid column errors

> If you want the official latest Chinook database, download it from:  
> [Chinook Database GitHub](https://github.com/lerocha/chinook-database)

---


## Project Structure

```
query_genie/
├─ app/
│  ├─ main.py           # FastAPI app
│  ├─ llm.py            # LLM SQL generation (Ollama/OpenAI)
│  ├─ db.py             # SQLite query execution
│  ├─ schema.py         # Pydantic models for request/response
|  └─ static
│      └─ static.html    # Frontend HTML with default question
├─ data/chinook.db       # SQLite sample database included
├─ requirements.txt     # Python dependencies
├─ README.md            # Project documentation
```

---

## Notes

- Browser tab titles for `/docs` and `/redoc` are customized via FastAPI route overrides  
- Dynamic schema reduces “column does not exist” errors but may still need validation for complex queries  
- Designed as a **portfolio/demo project**, easy to extend for production use

---

## Optional: Usage Example

1. Open `/docs`  
2. Enter a question like:

```
Show total revenue per category
```

3. Click **Execute**  
4. The response includes:

```json
{
  "sql": "SELECT Category, SUM(Total) FROM Invoices GROUP BY Category;",
  "results": [
    {"Category": "Rock", "SUM(Total)": 1234.56},
    {"Category": "Jazz", "SUM(Total)": 789.01}
  ]
}
```
