#!/bin/bash


big_number=10

min_num=1

i=$min_num
while [ $i -le $big_number ];
do
        curl -i -H "Content-Type: application/json" -X POST -d '{"title":"title new sticker", "memo":"text genereted", "folder_id":1}' http://127.0.0.1:5000/api/v1.1/sticker
        echo $i
        i=$[i+1]
done

# curl -X "DELETE" http://127.0.0.1:5000/api/sticker/10265
# curl -i -H "Content-Type: application/json" -X POST -d '{"status": false, "text":"to fo something", "sticker_id": 10280}' http://127.0.0.1:5000/api/task
