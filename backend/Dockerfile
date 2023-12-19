FROM python:3.9

WORKDIR /src

COPY scripts ./scripts/
COPY images ./images/
COPY .env ./

COPY requirements.txt ./
RUN pip3 install -r requirements.txt

ENTRYPOINT ["python3", "-u", "./scripts/app.py"]

# docker build -t vox-automata-backend:latest . 
