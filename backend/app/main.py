from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.schemas import QueryRequest, QueryResponse
from app.llm import generate_sql, is_sql_safe
from app.db import run_query

app = FastAPI(title="QueryGenie")
app.mount("/static", StaticFiles(directory="app/static"), name="static")

from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="QueryGenie",
    )


@app.get("/redoc", include_in_schema=False)
async def custom_redoc():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title="QueryGenie - ReDoc",
    )


@app.get("/", include_in_schema=False)
async def root():
    return FileResponse("app/static/index.html")


@app.post("/query", response_model=QueryResponse)
async def query(req: QueryRequest):
    question = req.question
    sql = generate_sql(question)
    if not sql:
        raise HTTPException(status_code=500, detail="Failed to generate SQL")
    if not is_sql_safe(sql):
        raise HTTPException(
            status_code=400, detail="Generated SQL failed safety checks"
        )
    try:
        results = run_query(sql)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"SQL execution error: {str(e)}.")
    return QueryResponse(sql=sql, results=results)
