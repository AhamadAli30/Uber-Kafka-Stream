Steps to Run 

1. cd kafka
2. docker-compose up -d
3. docker exec #af546e55d40c# kafka-topics --create --bootstrap-server kafka1:19091 --replication-factor 2 --partitions 2 --topic ride-requests

4. cd server
5. node producer.js
6. node consumer.js

7. cd customer
8. npx serve .

9. cd driver
10. npx serve .
