# report tools
#report engine lab to generate report from server side data to some format pdf, excel 
#tested generate thousands of pdf pages and excel rows with
#this code not cover the subject of creating data from db, this would be charge to mongo aggregation or sql query

#dev and tested with nodejs v15.0.1

#run separate client and server 
yarn run server 
yarn run app 

#access frontend 
http://localhost:3001/
#access backend 
http://localhost:3000/


#build client and run server
yarn run build
yarn run server 

#access built frontend and backend 
http://localhost:3000/

#if any error
rm -rf node_modules
yarn 
yarn run server

#if you wish to try modify or replace the following files with yours then see result
loopback/data/* //data files
loopback/template/* //template files

#try front end
http://localhost:3000/
select pdf/excel, type the number of report page wish to create, select option then submit
