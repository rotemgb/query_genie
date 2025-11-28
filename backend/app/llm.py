import os
import requests

from app.db import get_db_schema


# OpenAI settings
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Ollama fallback settings
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "sqlcoder")


PROMPT_TEMPLATE = """
You are an expert SQLite translator.

The database has these tables and columns:
{schema_text}

Rules:
- Generate valid SQLite queries only.
- Only use the tables/columns listed in the schema above.
- Produce only SQL (no explanation).

Question:
{question}

SQL:
"""


def is_sql_safe(sql: str) -> bool:
    """
    Very basic SQL safeguarding. Ensures no DROP/DELETE/UPDATE/INSERT unless
    explicitly intended.
    """
    banned = ["drop ", "delete ", "update ", "insert ", "alter "]
    lower = sql.lower()

    return not any(b in lower for b in banned)


# -------------------------
#  CALL OLLAMA (local + free)
# -------------------------
def call_ollama(prompt: str) -> str:
    payload = {"model": OLLAMA_MODEL, "prompt": prompt, "stream": False}

    r = requests.post(OLLAMA_URL, json=payload)
    r.raise_for_status()

    data = r.json()
    text = data.get("response", "").strip()
    return text


# -------------------------
#  CALL OpenAI (only if api key is provided)
# -------------------------
def call_openai(prompt: str) -> str:

    from openai import OpenAI

    client = OpenAI(api_key=OPENAI_API_KEY)

    completion = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
    )

    return completion.choices[0].message["content"].strip()


def generate_sql(question: str) -> str:
    schema_text = get_db_schema()
    print(schema_text)
    prompt = PROMPT_TEMPLATE.format(question=question, schema_text=schema_text)

    if OPENAI_API_KEY:
        sql = call_openai(prompt)
    else:
        sql = call_ollama(prompt)

    if not is_sql_safe(sql):
        return f"-- BLOCKED UNSAFE SQL --\n-- Model suggested: {sql}"

    return sql.replace("<s>", "").replace("</s>", "").strip()
