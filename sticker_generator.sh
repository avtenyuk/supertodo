#!/bin/bash


big_number=10

min_num=1

i=$min_num
while [ $i -le $big_number ];
do
        curl -i -H "Content-Type: application/json" -X POST -d '{"title":"title new sticker", "memo":"text genereted", "folder_id":1}' http://127.0.0.1:5000/api/sticker
        echo $i
        i=$[i+1]
done

# curl -X "DELETE" http://127.0.0.1:5000/api/sticker/10265
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "8dbeb5b9e2838dc1c65fd44be8a8fb73f8e68388"}' http://127.0.0.1:5000/api/sticker
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "8dbeb5b9e2838dc1c65fd44be8a8fb73f8e68388", "trash": "true"}' http://127.0.0.1:5000/api/sticker
curl -i -H "Content-Type: application/json" -X POST -d '{"token": "8dbeb5b9e2838dc1c65fd44be8a8fb73f8e68388", "title": "SKJDJAKSJDKKJSKKJ", "memo":"many text", "folder_id": 18}' http://127.0.0.1:5000/api/sticker
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "8dbeb5b9e2838dc1c65fd44be8a8fb73f8e68388"}' http://127.0.0.1:5000/api/sticker/10297
curl -i -H "Content-Type: application/json" -X DELETE -d '{"token": "8dbeb5b9e2838dc1c65fd44be8a8fb73f8e68388"}' http://127.0.0.1:5000/api/sticker/10297
