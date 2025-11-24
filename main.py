# main.py
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import pandas as pd
from io import StringIO
from database import SalaryRecord, get_db
import uvicorn

app = FastAPI(title="Зарплатная аналитика — бета")

@app.get("/admin", response_class=HTMLResponse)
async def admin_portal():
    return """
    <h1>Загрузи CSV с вакансиями</h1>
    <form action="/upload" enctype="multipart/form-data" method="post">
        <input type="file" name="file" accept=".csv"><br><br>
        <button type="submit">Загрузить и сохранить</button>
    </form>
    <p>Ожидаемые колонки в CSV: position, grade, city, salary_from, salary_to, source</p>
    """

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(400, detail="Только CSV, брат")
    
    content = await file.read()
    df = pd.read_csv(StringIO(content.decode("utf-8")))
    
    expected = ["position", "grade", "city", "salary_from", "salary_to", "source"]
    if not all(col in df.columns for col in expected):
        raise HTTPException(400, detail=f"Нужны колонки: {expected}")
    
    records = []
    for _, row in df.iterrows():
        record = SalaryRecord(
            position=row["position"],
            grade=row["grade"],
            city=row["city"],
            salary_from=row["salary_from"],
            salary_to=row["salary_to"],
            source=row["source"]
        )
        records.append(record)
    
    db.add_all(records)
    db.commit()
    
    return {"status": "ok", "загружено строк": len(records)}

@app.get("/analytics")
async def get_analytics(position: str, city: str = None, db: Session = Depends(get_db)):
    query = db.query(SalaryRecord)
    query = query.filter(SalaryRecord.position.ilike(f"%{position}%"))
    if city:
        query = query.filter(SalaryRecord.city.ilike(f"%{city}%"))
    
    records = query.all()
    if not records:
        raise HTTPException(404, detail="Ничего не найдено, попробуй другой запрос")
    
    # Считаем среднюю зарплату по вилке (от и до)
    salaries = []
    for r in records:
        if r.salary_from and r.salary_to:
            salaries.append((r.salary_from + r.salary_to) / 2)
        elif r.salary_from:
            salaries.append(r.salary_from)
        elif r.salary_to:
            salaries.append(r.salary_to)
    
    df = pd.DataFrame(salaries, columns=["salary"])
    
    result = {
        "position": position,
        "city": city or "все города",
        "количество_вакансий": len(salaries),
        "медиана": round(df["salary"].median(), 0),
        "25-й перцентиль": round(df["salary"].quantile(0.25), 0),
        "75-й перцентиль": round(df["salary"].quantile(0.75), 0),
        "мин": round(df["salary"].min(), 0),
        "макс": round(df["salary"].max(), 0),
        "среднее": round(df["salary"].mean(), 0),
    }
    
    return result

@app.get("/view", response_class=HTMLResponse)
async def view_analytics(position: str, city: str = None, db: Session = Depends(get_db)):
    query = db.query(SalaryRecord)
    query = query.filter(SalaryRecord.position.ilike(f"%{position}%"))
    if city:
        query = query.filter(SalaryRecord.city.ilike(f"%{city}%"))
    
    records = query.all()
    if not records:
        return f"<h1>Ничего не найдено по «{position} {city or ''}»</h1>"

    salaries = []
    for r in records:
        if r.salary_from and r.salary_to:
            salaries.append((r.salary_from + r.salary_to) / 2)
        elif r.salary_from:
            salaries.append(r.salary_from)
        elif r.salary_to:
            salaries.append(r.salary_to)

    if not salaries:
        return "<h1>Вакансии есть, но зарплаты не указаны</h1>"

    df = pd.DataFrame(salaries, columns=["salary"])
    stats = {
        "count": len(salaries),
        "min": int(df["salary"].min()),
        "q25": int(df["salary"].quantile(0.25)),
        "median": int(df["salary"].median()),
        "q75": int(df["salary"].quantile(0.75)),
        "max": int(df["salary"].max()),
        "mean": int(df["salary"].mean()),
    }

    # ← ВОТ ЭТО ГЛАВНОЕ ИСПРАВЛЕНИЕ
    salaries_json = "[" + ",".join(map(str, salaries)) + "]"

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Зарплаты: {position} {city or ''}</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; background: #f8f9fa; }}
            h1, h2 {{ color: #2c3e50; }}
            .card {{ background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px; }}
            canvas {{ max-width: 100%; }}
        </style>
    </head>
    <body>
        <h1>Зарплатная аналитика</h1>
        <p><b>{position}</b> {f"· {city}" if city else "· все города"} · {stats['count']} вакансий</p>

        <div class="card">
            <h2>Ключевые цифры</h2>
            <b>Медиана:</b> {stats['median']:,} ₽ &ensp;|&ensp;
            <b>25–75%:</b> {stats['q25']:,} – {stats['q75']:,} ₽ &ensp;|&ensp;
            <b>Среднее:</b> {stats['mean']:,} ₽
        </div>

        <div class="card">
            <canvas id="distributionChart"></canvas>
        </div>

        <script>
            const salaries = {salaries_json};

            const ctx = document.getElementById('distributionChart').getContext('2d');
            new Chart(ctx, {{
                type: 'violin',
                data: {{
                    labels: ['{position}'],
                    datasets: [{{
                        label: 'Распределение зарплат',
                        data: [salaries],
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: '#36A2EB',
                        borderWidth: 2
                    }}]
                }},
                options: {{
                    responsive: true,
                    plugins: {{
                        title: {{ display: true, text: 'Распределение зарплат (₽)' }},
                        legend: {{ display: false }}
                    }},
                    scales: {{
                        y: {{ beginAtZero: false, ticks: {{ callback: v => v.toLocaleString() + ' ₽' }} }}
                    }}
                }}
            }});
        </script>

        <script src="https://cdn.jsdelivr.net/npm/chartjs-chart-box-and-violin-plot@3.5.0/build/Chart.BoxPlot.min.js"></script>
    </body>
    </html>
    """

frontend_dir = Path(__file__).parent / "frontend" / "dist"
if frontend_dir.exists():
    app.mount(
        "/",
        StaticFiles(directory=str(frontend_dir), html=True),
        name="frontend",
    )
else:
    print(
        "⚠️  Frontend build не найден. "
        "Собери его командой `cd frontend && npm run build` для отдачи статики."
    )

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

