FROM python:3

WORKDIR /app

# # Create and activate virtual environment
# RUN python3 -m venv .venv
# ENV PATH="/app/.venv/bin:$PATH"

# Install dependencies
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the application
COPY backend/ .

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]