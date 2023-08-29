FROM python:3.9

WORKDIR /src

COPY requirements.txt ./
RUN pip3 install -r requirements.txt

COPY images ./images/
COPY app.py ./
COPY backend_functions.py ./
COPY text_generation.py ./
COPY .env ./

ENTRYPOINT ["python3", "-u", "./app.py"]

# docker build -t vox-automata-backend:latest . 
