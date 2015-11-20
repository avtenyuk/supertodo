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
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154"}' http://127.0.0.1:5000/api/sticker
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "8dbeb5b9e2838dc1c65fd44be8a8fb73f8e68388", "trash": "true"}' http://127.0.0.1:5000/api/sticker
curl -i -H "Content-Type: application/json" -X POST -d '{"token": "8dbeb5b9e2838dc1c65fd44be8a8fb73f8e68388", "title": "SKJDJAKSJDKKJSKKJ", "memo":"many text", "folder_id": 18}' http://127.0.0.1:5000/api/sticker
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154"}' http://127.0.0.1:5000/api/sticker/10301
curl -i -H "Content-Type: application/json" -X DELETE -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154"}' http://127.0.0.1:5000/api/sticker/10300
curl -i -H "Content-Type: application/json" -X PUT -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154", "title": "JOPA", "memo":"MEMO JOPA"}' http://127.0.0.1:5000/api/sticker/10301

curl -i -H "Content-Type: application/json" -X GET -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154", "sticker_id": 10301}' http://127.0.0.1:5000/api/task
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154"}' http://127.0.0.1:5000/api/task/30
curl -i -H "Content-Type: application/json" -X POST -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154", "text": "test big task", "sticker_id": 10301}' http://127.0.0.1:5000/api/task
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154"}' http://127.0.0.1:5000/api/task/30
