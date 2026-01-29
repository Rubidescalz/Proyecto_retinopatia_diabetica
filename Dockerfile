FROM python:3.11-slim

WORKDIR /app

# Copiar requirements del backend
COPY BanckEnd/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el contenido del backend
COPY BanckEnd/ .

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
