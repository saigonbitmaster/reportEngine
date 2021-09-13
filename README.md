# Report tools
#report engine lab to generate report from server side data to some format pdf, excel 
#tested generate thousands of pdf pages and excel rows with
#this code not cover the subject of creating data from db, this would be charge to mongo aggregation or sql query

#dev and tested with nodejs v15.0.1

#clone and run code: 
- git clone https://github.com/saigonbitmaster/reportEngine
- yarn
- yarn run server
- http://localhost:3000/


#run separate client and server 
- yarn run server 
- yarn run app 

#access frontend 
- http://localhost:3001/

#access api 
- http://localhost:3000/


#build client and run server
- yarn run build
- yarn run server 

#access built frontend and backend 
http://localhost:3000/

#if any error
rm -rf node_modules
yarn 
yarn run server

#if you wish to try modify or replace the following files with yours then see result
loopback/data/* //data files
loopback/template/* //template files

#try to generate report
http://localhost:3000/
select pdf/excel, type the number of report page wish to create, select option then submit

![frontEnd](https://user-images.githubusercontent.com/89018674/132648889-dcb8c279-7470-4aa3-b826-46d0eb8b52ec.jpg)
![pdfScreenShot](https://user-images.githubusercontent.com/89018674/132648941-9313c3c9-ba85-476d-9502-8874a87948bf.jpg)
![excelScreenShot](https://user-images.githubusercontent.com/89018674/132648967-05afaa9c-c162-4fb5-b474-65190c95ae25.jpg)
