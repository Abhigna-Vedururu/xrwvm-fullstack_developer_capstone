FROM python:3.12.0-slim-bookworm

ENV PYTHONBUFFERED 1
ENV PYTHONWRITEBYTECODE 1
ENV APP=/app

# Set working directory
WORKDIR $APP

# Copy requirements and install dependencies
COPY requirements.txt $APP/
RUN pip3 install -r requirements.txt

# Copy app code
COPY . $APP

# Expose the port Django will run on
EXPOSE 8000

# Make entrypoint.sh executable
RUN chmod +x /app/entrypoint.sh

# Run entrypoint.sh script
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]

# Default command to start Gunicorn server
CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi"]
