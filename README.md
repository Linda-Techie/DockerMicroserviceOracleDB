# Restful Microservice Retrieve Oracle DB Template #

This service is a service-oriented architecture (SOA) design that is purposely built as a small independent service and it runs by it's own without dependent on a web nor application server platform in a docker container (ie. Web container or JEE server).

This template is built from OS-level ground up using CentOS, but can be easily switch to RHEL or Ubuntu. Oracle client is mandatory due to Oracle database connectivity. NodeJS is used to demostrate REST API call.

You need to download 3 Oracle client tar files from Oracle <a hred="http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html">website</a> based on your back-end Oracle database versions; put those 3 tar files in the "ora_client" folder. Then simply click on "run.sh" to compile and run the docker image from ground up.

You may want to modify the REST API exposed port based on your environment or open the port in your infrastrcture.

This template was created in Google Cloud Platform. Also tested in Amazon AWS.

### Pre-req -- Following tasks were created based on Google Cloud Platform (GCP) Compute Engine VM Instance ###
1. ```$ sudo yum install -y yum-utils wget git```
2. ```$ wget https://download.docker.com/linux/centos/docker-ce.repo; mv docker-ce.repo /etc/yum.repos.d/```
3. ```$ sudo yum -y install docker-ce python-pip```
4. ```$ sudo systemctl enable docker; sudo systemctl start docker```
5. ```$ git clone https://github.ibm.com/DataScienceCoC/microservice_oracle_template.git```
6. Download Oracle client files based on your Oracle database version from the link above. 3 files are needed. Please see the image example in the "ora_client" folder. This template was tested with Oracle v.12.1.0.2.

## Build and Run the Docker Image ##
```$ run.sh ```

## Now the microservice is ready for down stream application call. Following is a simple test from a browser ##

Point to URL:

  [http://<Deployed_Server>:2200/employee]

  [http://<Deployed_Server>:2200/employee/Linda]


