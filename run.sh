docker build -t exxon_ms1 .
docker run -it -p 2200:2200 --env-file ./envfile.list exxon_ms1
