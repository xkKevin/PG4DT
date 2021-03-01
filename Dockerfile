# FROM registry.zjvis.org/xiongkai/viscovid:d8.15
FROM python:3.7

WORKDIR /PG4DT
COPY ./ /PG4DT

EXPOSE 80
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple flask

CMD ["python", "backend/app.py"]
