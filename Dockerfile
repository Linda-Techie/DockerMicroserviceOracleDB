FROM centos:centos7

WORKDIR /app

ADD . /app
ADD epel.repo /etc/yum.repos.d/epel.repo
ADD ol7.repo /etc/yum.repod.d/
Add ./ora_client/ /tmp/


RUN yum -y update && \
    rm -rf /var/cache/yum && \
    yum -y install nodejs && \
    yum install -y libaio.x86_64 glibc.x86_64 && \
    yum -y localinstall /tmp/oracle* --nogpgcheck

RUN npm install
RUN mkdir /usr/lib/oracle/12.1/client64/network/admin -p

COPY ./package.json /app
COPY ./server.js /app
COPY ./tnsnames.ora /usr/lib/oracle/12.1/client64/network/admin/tnsnames.ora

ENV ORACLE_HOME=/usr/lib/oracle/12.1/client64
ENV PATH=$PATH:$ORACLE_HOME/bin
ENV LD_LIBRARY_PATH=$ORACLE_HOME/lib
ENV TNS_ADMIN=$ORACLE_HOME/network/admin

CMD ["npm","start"]
