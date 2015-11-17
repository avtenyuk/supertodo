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
# curl -i -H "Content-Type: application/json" -X POST -d '{"status": false, "text":"to fo something", "sticker_id": 10280}' http://127.0.0.1:5000/api/task
# curl -i -H "Content-Type: application/json" -X PUT -d '{"status": "true"}' http://127.0.0.1:5000/api/task/10
# curl -i -H "Content-Type: application/json" -X GET -d '{"csrf_token": "64b2fb6ab0d39e4ad8b84bf3079616114fb66dc6"}' http://127.0.0.1:5000/api/sticker
