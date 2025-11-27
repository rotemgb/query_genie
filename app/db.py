import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "chinook.db"


def run_query(sql: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    try:
        cur.execute(sql)
        return [dict(row) for row in cur.fetchall()]
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()


def get_db_schema() -> str:
    """
    Returns a text description of the SQLite schema for LLM prompts.
    """
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    schema_lines = []
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cur.fetchall()]

    for table in tables:
        cur.execute(f"PRAGMA table_info({table});")
        columns = [col[1] for col in cur.fetchall()]
        schema_lines.append(f"- {table}({', '.join(columns)})")

    conn.close()
    return "\n".join(schema_lines)
